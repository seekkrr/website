"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { registerCreator } from "@/lib/api";
import { clientState } from "@/lib/clientState";
import { siteConfig } from "@/lib/config/site";

// ── Constants ──────────────────────────────────────────────────────────────

const AUTO_CLOSE_DELAY_MS = 6_000;

// ── Sanitisation ───────────────────────────────────────────────────────────

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
                    "Name can only contain letters, spaces, hyphens, and apostrophes",
                ),
        ),
    email: z
        .string()
        .transform((v) => stripTags(v).trim().toLowerCase())
        .pipe(
            z
                .string()
                .min(1, "Email is required")
                .email("Enter a valid email address")
                .max(254, "Email is too long"),
        ),
    phone: z
        .string()
        .transform((v) => stripTags(v).trim())
        .pipe(
            z
                .string()
                .regex(
                    /^$|^\+?\d[\d\s\-()]{7,18}\d$/,
                    "Enter a valid phone number (e.g. +91 9875543210)",
                ),
        ),
    socialLinks: z
        .array(
            z.string().transform((v) => stripTags(v).trim()),
        )
        .min(1, "Please provide at least one social media link"),
});

type FormErrors = Partial<Record<keyof z.input<typeof registerSchema> | "socialInput", string>>;

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

// ── Component ──────────────────────────────────────────────────────────────

export function CreatorRegisterModal({ isOpen, onClose, onSuccess }: CreatorRegisterModalProps) {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        socialLinks: [],
    });
    const [socialInput, setSocialInput] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Handlers ─────────────────────────────────────────────────────────

    const handleClose = useCallback(() => {
        if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
        onClose();
        // Reset after exit animation completes
        setTimeout(() => {
            setFormData({ name: "", email: "", phone: "", socialLinks: [] });
            setSocialInput("");
            setErrors({});
            setIsSuccess(false);
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

    const handleSocialInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        setFormData((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If they have text in the social input but haven't hit enter, add it automatically
        let currentData = { ...formData };
        if (socialInput.trim()) {
            currentData.socialLinks = [...currentData.socialLinks, socialInput.trim()];
            setSocialInput("");
            setFormData(currentData);
        }

        const result = registerSchema.safeParse(currentData);

        if (!result.success) {
            // Map zod issues → per-field error messages
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
        setApiError(null);

        try {
            await registerCreator({
                name: sanitised.name,
                email: sanitised.email,
                ...(sanitised.phone && { phone: sanitised.phone }),
                socialLinks: sanitised.socialLinks,
            });
            clientState.set("creatorRegistered", "true", 365); // Expire in 1 year
            setIsSuccess(true);
            onSuccess?.();
        } catch (err) {
            setApiError(
                err instanceof Error ? err.message : "Something went wrong. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
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
                                            className={`w-full px-4 py-3 bg-theme-beige border-2 rounded-lg text-black placeholder:text-black/40 text-[15px] outline-none transition-colors ${errors.name
                                                ? "border-red-600 focus:border-red-600"
                                                : "border-black/80 focus:border-black"
                                                }`}
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
                                            className={`w-full px-4 py-3 bg-theme-beige border-2 rounded-lg text-black placeholder:text-black/40 text-[15px] outline-none transition-colors ${errors.email
                                                ? "border-red-600 focus:border-red-600"
                                                : "border-black/80 focus:border-black"
                                                }`}
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
                                            Phone No. <span className="font-normal text-black/60">(Optional)</span>
                                        </label>
                                        <input
                                            id="register-phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+91 9875543210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-theme-beige border-2 rounded-lg text-black placeholder:text-black/40 text-[15px] outline-none transition-colors ${errors.phone
                                                ? "border-red-600 focus:border-red-600"
                                                : "border-black/80 focus:border-black"
                                                }`}
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
                                            Link to Instagram/ Youtube page<span className="text-red-700">*</span>
                                        </label>
                                        <div
                                            className={`w-full px-4 py-2 bg-theme-beige border-2 rounded-lg flex flex-wrap gap-2 items-center transition-colors min-h-[50px] text-black ${errors.socialLinks
                                                ? "border-red-600 focus-within:border-red-600"
                                                : "border-black/80 focus-within:border-black"
                                                }`}
                                        >
                                            {formData.socialLinks.map((link, i) => (
                                                <span key={i} className="flex items-center gap-1.5 bg-white border border-black/30 rounded-full px-3 py-1 text-[14px] font-medium text-black">
                                                    {link}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSocialLink(i)}
                                                        className="text-black/60 hover:text-black transition-colors flex items-center justify-center shrink-0 w-4 h-4 rounded-full"
                                                        aria-label="Remove link"
                                                    >
                                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
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
                                                placeholder={formData.socialLinks.length === 0 ? "Add your social media pages" : ""}
                                                value={socialInput}
                                                onChange={(e) => {
                                                    setSocialInput(e.target.value);
                                                    if (errors.socialLinks) setErrors((prev) => ({ ...prev, socialLinks: undefined }));
                                                }}
                                                onKeyDown={handleSocialInputKeyDown}
                                                onBlur={addSocialLink} // add when they click away
                                                className="flex-1 min-w-[150px] bg-transparent outline-none text-black placeholder:text-black/40 text-[15px]"
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
                                    <div className="flex justify-center">
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
                                                    Submitting…
                                                </>
                                            ) : (
                                                "Become A Creator"
                                            )}
                                        </button>
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
                                        <br /> We will revert to you on email
                                        <br /> within 2 business days
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

