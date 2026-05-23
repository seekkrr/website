"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { registerCreator, ApiError } from "@/lib/api";
import { clientState } from "@/lib/clientState";
import { siteConfig } from "@/lib/config/site";
import { useClientStatePolling } from "@/lib/hooks/useClientStatePolling";

// ── Constants ──────────────────────────────────────────────────────────────

const AUTO_CLOSE_DELAY_MS = 6_000;

// ── Sanitisation ───────────────────────────────────────────────────────────
// Strips HTML / script tags to prevent XSS when the value is ever rendered
// or forwarded. This runs *before* zod's own validations via `.transform`.

const stripTags = (v: string) => v.replace(/[<>]/g, "");

// ── Zod Schema ─────────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z
    .string()
    .transform((v) => stripTags(v).trim())
    .pipe(
      z
        .string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be under 100 characters")
        .regex(
          /^[\p{L}\p{M}'\-\s.]+$/u,
          "Name can only contain letters, spaces, hyphens, and apostrophes"
        )
    ),
  email: z
    .string()
    .transform((v) => stripTags(v).trim().toLowerCase())
    .pipe(
      z
        .string()
        .min(1, "Email is required")
        .regex(
          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
          "Enter a valid email address"
        )
        .max(254, "Email is too long")
    ),
  phone: z
    .string()
    .transform((v) => stripTags(v).trim())
    .refine(
      (v) => !v || /^[+]?[\d\s\-()]{5,20}$/.test(v),
      "Enter a valid phone number (e.g. +91 9875543210 or 098-7554-3210)"
    ),
  socialLinks: z
    .array(
      z
        .string()
        .transform((v) => stripTags(v).trim())
        .refine(
          (url) => url.startsWith("https://"),
          "Social media links must be HTTPS URLs"
        )
    )
    .min(1, "Please provide at least one social media link")
    .max(10, "Maximum 10 social media links allowed"),
});

type FormErrors = Partial<
  Record<keyof z.input<typeof registerSchema> | "socialInput", string>
>;

// ── Types ──────────────────────────────────────────────────────────────────

interface CreatorRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  socialLinks: string[];
}

type LinkStatus = "idle" | "verifying" | "success" | "error";

// ── Component ──────────────────────────────────────────────────────────────

export function CreatorRegisterModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatorRegisterModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    socialLinks: [],
  });
  const [socialInput, setSocialInput] = useState("");
  const [linkStatuses, setLinkStatuses] = useState<Record<number, LinkStatus>>(
    {}
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const { hasState: persistedSuccess, forceCheck } =
    useClientStatePolling("creatorRegistered");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const isSuccess = persistedSuccess || submitSuccess;
  const [apiError, setApiError] = useState<string | null>(null);
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Persistence & Multi-submission ──────────────────────────────────
  // Handled by the useClientStatePolling hook above.

  // ── Handlers ─────────────────────────────────────────────────────────

  const handleClose = useCallback(() => {
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    onClose();
    // Reset after exit animation completes
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", socialLinks: [] });
      setSocialInput("");
      setLinkStatuses({});
      setErrors({});
      setSubmitSuccess(false);
      setVerificationStep(false);
      setApiError(null);
    }, 300);
  }, [onClose]);

  // ── Auto-close on success ────────────────────────────────────────────

  useEffect(() => {
    if (isSuccess) {
      autoCloseTimer.current = setTimeout(() => {
        handleClose();
      }, AUTO_CLOSE_DELAY_MS);
    }
    return () => {
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    };
  }, [isSuccess, handleClose]);

  // ── Escape key ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  // ── Lock body scroll while open ──────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const handleSocialInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSocialLink();
    }
  };

  const addSocialLink = () => {
    const link = socialInput.trim();
    // Check array bounds / empty so we don't spam empty
    if (link) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: [...prev.socialLinks, link],
      }));
      setSocialInput("");
      if (errors.socialLinks) {
        setErrors((prev) => ({ ...prev, socialLinks: undefined }));
      }
    }
  };

  const removeSocialLink = (index: number) => {
    if (isSubmitting) return; // Prevent removal during verification
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
    setLinkStatuses((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If they have text in the social input but haven't hit enter, add it automatically
    let currentData = { ...formData };
    if (socialInput.trim()) {
      currentData.socialLinks = [
        ...currentData.socialLinks,
        socialInput.trim(),
      ];
      setSocialInput("");
      setFormData(currentData);
    }

    const result = registerSchema.safeParse(currentData);

    if (!result.success) {
      // Map zod issues ⇒ per-field error messages
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    const sanitised = result.data;

    setIsSubmitting(true);
    setVerificationStep(true); // Shows "Verifying Links..." spinner
    setApiError(null);

    // Set all links to 'verifying' instantly
    const initialStatuses = Object.fromEntries(
      sanitised.socialLinks.map((_, i) => [i, "verifying"])
    ) as Record<number, LinkStatus>;
    setLinkStatuses(initialStatuses);

    // Final Submission directly
    try {
      await registerCreator({
        name: sanitised.name,
        email: sanitised.email,
        ...(sanitised.phone && { phone: sanitised.phone }),
        social_links: sanitised.socialLinks,
      });

      // All good
      const successStatuses = Object.fromEntries(
        sanitised.socialLinks.map((_, i) => [i, "success"])
      ) as Record<number, LinkStatus>;
      setLinkStatuses(successStatuses);

      clientState.set("creatorRegistered", "true", 10 / 1440);
      forceCheck(); // Immediately sync state without waiting for next poll
      setSubmitSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      if (err?.status === 422 && err?.data?.failed_links) {
        const newStatuses: Record<number, LinkStatus> = {};
        const failedUrls = err.data.failed_links.map(
          (f: { url: string }) => f.url
        );

        sanitised.socialLinks.forEach((link, i) => {
          if (failedUrls.includes(link)) {
            newStatuses[i] = "error";
          } else {
            newStatuses[i] = "success";
          }
        });
        setLinkStatuses(newStatuses);

        // Show specific reasons in the main error block
        const detailedError =
          err.message || "One or more links are broken or invalid.";
        setApiError(detailedError);
      } else {
        // Other errors (409, 400, 500)
        setLinkStatuses({}); // Clear individual link statuses if it's a general/form error
        const errorMsg =
          err instanceof Error
            ? err.message
            : err?.data?.message ||
              err?.message ||
              "Something went wrong. Please try again.";
        setApiError(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
      setVerificationStep(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-[420px] bg-theme-yellow border-[3px] border-black rounded-2xl px-7 py-8 sm:px-9 sm:py-10 shadow-2xl font-jakarta"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Register as a Creator"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full border-2 border-black/60 text-black/70 hover:text-black hover:border-black transition-colors"
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4l8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                /* ── Registration Form ──────────────────────────────── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Heading */}
                  <h2 className="text-center text-[22px] sm:text-[26px] font-bold leading-tight text-black mb-7">
                    Register and Become
                    <br />
                    a Creator on
                    <br />
                    SeekKrr
                  </h2>

                  {/* Name Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="register-name"
                      className="block text-[15px] font-semibold text-black mb-1.5"
                    >
                      Name<span className="text-red-700">*</span>
                    </label>
                    <input
                      id="register-name"
                      name="name"
                      type="text"
                      placeholder="First Name + Last Name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 bg-theme-beige border-2 rounded-lg text-black placeholder:text-black/40 text-[15px] outline-none transition-colors ${
                        errors.name
                          ? "border-red-600 focus:border-red-600"
                          : "border-black/80 focus:border-black"
                      } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-[13px] text-red-700 font-medium tracking-tight">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="register-email"
                      className="block text-[15px] font-semibold text-black mb-1.5"
                    >
                      Email<span className="text-red-700">*</span>
                    </label>
                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="abc@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 bg-theme-beige border-2 rounded-lg text-black placeholder:text-black/40 text-[15px] outline-none transition-colors ${
                        errors.email
                          ? "border-red-600 focus:border-red-600"
                          : "border-black/80 focus:border-black"
                      } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-[13px] text-red-700 font-medium tracking-tight">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="register-phone"
                      className="block text-[15px] font-semibold text-black mb-1.5"
                    >
                      Phone No.{" "}
                      <span className="font-normal text-black/60">
                        (Optional)
                      </span>
                    </label>
                    <input
                      id="register-phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 9875543210"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 bg-theme-beige border-2 rounded-lg text-black placeholder:text-black/40 text-[15px] outline-none transition-colors ${
                        errors.phone
                          ? "border-red-600 focus:border-red-600"
                          : "border-black/80 focus:border-black"
                      } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-[13px] text-red-700 font-medium tracking-tight">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Social Links Field */}
                  <div className="mb-6">
                    <label
                      htmlFor="register-social"
                      className="block text-[15px] font-semibold text-black mb-1.5"
                    >
                      Link to Instagram/ Youtube page
                      <span className="text-red-700">*</span>
                    </label>
                    <div
                      className={`w-full px-4 py-2 bg-theme-beige border-2 rounded-lg flex flex-wrap gap-2 items-center transition-colors min-h-[50px] text-black ${
                        errors.socialLinks
                          ? "border-red-600 focus-within:border-red-600"
                          : "border-black/80 focus-within:border-black"
                      } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {formData.socialLinks.map((link, i) => (
                        <span
                          key={i}
                          className={`flex items-center gap-1.5 bg-white border rounded-full px-3 py-1 text-[14px] font-medium text-black transition-colors ${
                            linkStatuses[i] === "success"
                              ? "border-green-500 bg-green-50"
                              : linkStatuses[i] === "error"
                                ? "border-red-500 bg-red-50"
                                : "border-black/30"
                          }`}
                        >
                          {linkStatuses[i] === "verifying" && (
                            <svg
                              className="animate-spin h-3 w-3 text-black/40"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                          )}
                          {linkStatuses[i] === "success" && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 16 16"
                              fill="none"
                              className="text-green-600"
                            >
                              <path
                                d="M13.3333 4L5.99996 11.3333L2.66663 8"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          {linkStatuses[i] === "error" && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 16 16"
                              fill="none"
                              className="text-red-600"
                            >
                              <path
                                d="M12 4L4 12M4 4l8 8"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                          {link}
                          <button
                            type="button"
                            onClick={() => removeSocialLink(i)}
                            disabled={isSubmitting}
                            className="text-black/60 hover:text-black transition-colors flex items-center justify-center shrink-0 w-4 h-4 rounded-full disabled:hidden"
                            aria-label="Remove link"
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M12 4L4 12M4 4l8 8"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                      <input
                        id="register-social"
                        type="text"
                        placeholder={
                          formData.socialLinks.length === 0
                            ? "Add your social media pages"
                            : ""
                        }
                        value={socialInput}
                        onChange={(e) => {
                          setSocialInput(e.target.value);
                          if (errors.socialLinks)
                            setErrors((prev) => ({
                              ...prev,
                              socialLinks: undefined,
                            }));
                        }}
                        onKeyDown={handleSocialInputKeyDown}
                        onBlur={addSocialLink}
                        disabled={isSubmitting}
                        className="flex-1 min-w-[150px] bg-transparent outline-none text-black placeholder:text-black/40 text-[15px] disabled:hidden"
                      />
                    </div>
                    {errors.socialLinks && (
                      <p className="mt-1 text-[13px] text-red-700 font-medium tracking-tight">
                        {errors.socialLinks}
                      </p>
                    )}
                  </div>

                  {/* API Error */}
                  {apiError && (
                    <p className="mb-4 text-center text-[14px] text-red-700 font-medium tracking-tight">
                      {apiError}
                    </p>
                  )}

                  {/* Submit Button */}
                  <div className="flex flex-col items-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-black text-white font-jakarta font-bold text-[17px] px-10 py-3.5 rounded-full border-2 border-black transition-all hover:bg-black/90 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          {verificationStep
                            ? "Verifying Links..."
                            : "Submitting..."}
                        </>
                      ) : (
                        "Become A Creator"
                      )}
                    </button>
                    {verificationStep && (
                      <p className="mt-3 text-[13px] text-black/60 font-medium text-center px-4">
                        Please wait 1-2 minutes while we verify your social
                        media links.
                      </p>
                    )}
                  </div>
                </motion.form>
              ) : (
                /* ── Success State ──────────────────────────────────── */
                <motion.div
                  key="success"
                  className="flex flex-col items-center justify-center min-h-[200px] text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-[22px] sm:text-[26px] font-bold leading-tight text-black mb-8 px-4">
                    Thank you for your interest.
                    <br /> We will revert to you
                    <br /> on email soon
                  </h2>

                  <button
                    onClick={handleClose}
                    className="bg-black text-white font-jakarta font-bold text-[17px] px-12 py-3.5 rounded-full border-2 border-black transition-all hover:bg-black/90 active:scale-[0.97]"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
