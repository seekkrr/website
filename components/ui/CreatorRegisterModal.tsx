"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerCreator } from "@/lib/api";
import { clientState } from "@/lib/clientState";
import { siteConfig } from "@/lib/config/site";
import { animationDefaults, modalDefaults } from "@/lib/config/theme";

// ── Zod Schema ─────────────────────────────────────────────────────────────

const registerSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be under 100 characters")
        .regex(
            /^[\p{L}\p{M}'\-\s.]+$/u,
            "Name can only contain letters, spaces, hyphens, and apostrophes",
        ),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email address")
        .max(254, "Email is too long"),
    phone: z
        .string()
        .optional()
        .refine((val) => !val || /^\+?\d{9,15}$/.test(val), {
            message: "Enter a valid phone number",
        }),
    socialLinks: z
        .array(z.string().url("Please enter valid URLs"))
        .min(1, "Please provide at least one social media link")
        .max(5, "Maximum 5 social media links allowed"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// ── Types ──────────────────────────────────────────────────────────────────

interface CreatorRegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

type LinkStatus = "idle" | "verifying" | "success" | "error";

// ── Component ──────────────────────────────────────────────────────────────

export function CreatorRegisterModal({ isOpen, onClose, onSuccess }: CreatorRegisterModalProps) {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            socialLinks: [],
        },
    });

    const [socialInput, setSocialInput] = useState("");
    const [linkStatuses, setLinkStatuses] = useState<Record<number, LinkStatus>>({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isCheckingState, setIsCheckingState] = useState(true);
    const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const socialLinks = watch("socialLinks");

    // ── Handlers ─────────────────────────────────────────────────────────

    const handleClose = useCallback(() => {
        if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
        onClose();
        // Reset after exit animation completes
        setTimeout(() => {
            reset();
            setSocialInput("");
            setLinkStatuses({});
            setIsSuccess(false);
            setIsVerifying(false);
            setApiError(null);
        }, animationDefaults.normal);
    }, [onClose, reset]);

    const addSocialLink = useCallback(() => {
        const link = socialInput.trim();
        if (link) {
            setValue("socialLinks", [...socialLinks, link]);
            setSocialInput("");
        }
    }, [socialInput, socialLinks, setValue]);

    const removeSocialLink = (index: number) => {
        setValue(
            "socialLinks",
            socialLinks.filter((_, i) => i !== index),
        );
        setLinkStatuses((prev) => {
            const next = { ...prev };
            delete next[index];
            return next;
        });
    };

    const handleSocialKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addSocialLink();
        }
    };

    const validateAllLinks = async (links: string[]) => {
        setIsVerifying(true);
        let allValid = true;

        for (let i = 0; i < links.length; i++) {
            setLinkStatuses((prev) => ({ ...prev, [i]: "verifying" }));
            // Mock verification delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            const isBroken = links[i].toLowerCase().includes("broken") || links[i].toLowerCase().includes("404");
            if (!isBroken) {
                setLinkStatuses((prev) => ({ ...prev, [i]: "success" }));
            } else {
                setLinkStatuses((prev) => ({ ...prev, [i]: "error" }));
                allValid = false;
            }
        }

        return allValid;
    };

    const onSubmit = async (data: RegisterFormValues) => {
        setApiError(null);

        // Verify links before submission
        const linksOk = await validateAllLinks(data.socialLinks);
        if (!linksOk) {
            setApiError("One or more links are broken or invalid. Please check and try again.");
            setIsVerifying(false);
            return;
        }

        try {
            await registerCreator({
                name: data.name,
                email: data.email,
                ...(data.phone && { phone: data.phone }),
                socialLinks: data.socialLinks,
            });
            clientState.set("creatorRegistered", "true", 365);
            setIsSuccess(true);
            onSuccess?.();

            autoCloseTimer.current = setTimeout(() => {
                handleClose();
            }, modalDefaults.autoCloseFast);
        } catch (err) {
            setApiError(
                err instanceof Error ? err.message : "Something went wrong. Please try again.",
            );
        } finally {
            setIsVerifying(false);
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
                    transition={{ duration: animationDefaults.normal / 1000 }}
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
                        transition={{
                            type: "spring",
                            damping: animationDefaults.spring.damping,
                            stiffness: animationDefaults.spring.stiffness,
                        }}
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
                            disabled={isSubmitting}
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
                                    onSubmit={handleSubmit(onSubmit)}
                                    noValidate
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: animationDefaults.fast / 1000 }}
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
                                        <label htmlFor="name" className="block text-[15px] font-semibold text-black mb-1.5">
                                            Name<span className="text-red-700">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="First Name + Last Name"
                                            className={`w-full px-4 py-3 bg-theme-beige border-2 rounded-lg text-black placeholder:text-black/40 text-[15px] outline-none transition-colors ${
                                                errors.name
                                                    ? "border-red-600 focus:border-red-600"
                                                    : "border-black/80 focus:border-black"
                                            } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                                            {...register("name")}
                                            disabled={isSubmitting}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-[13px] text-red-700 font-medium tracking-tight">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-[15px] font-semibold text-black mb-1.5">
                                            Email<span className="text-red-700">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="abc@domain.com"
                                            className={`w-full px-4 py-3 bg-theme-beige border-2 rounded-lg text-black placeholder:text-black/40 text-[15px] outline-none transition-colors ${
                                                errors.email
                                                    ? "border-red-600 focus:border-red-600"
                                                    : "border-black/80 focus:border-black"
                                            } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                                            {...register("email")}
                                            disabled={isSubmitting}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-[13px] text-red-700 font-medium tracking-tight">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone Field */}
                                    <div className="mb-4">
                                        <label htmlFor="phone" className="block text-[15px] font-semibold text-black mb-1.5">
                                            Phone (optional)
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="+91 9876543210"
                                            className={`w-full px-4 py-3 bg-theme-beige border-2 rounded-lg text-black placeholder:text-black/40 text-[15px] outline-none transition-colors ${
                                                errors.phone
                                                    ? "border-red-600 focus:border-red-600"
                                                    : "border-black/80 focus:border-black"
                                            } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                                            {...register("phone")}
                                            disabled={isSubmitting}
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-[13px] text-red-700 font-medium tracking-tight">
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Social Links Field */}
                                    <div className="mb-5">
                                        <label htmlFor="social" className="block text-[15px] font-semibold text-black mb-2.5">
                                            Social Media<span className="text-red-700">*</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2 p-3 bg-theme-beige border-2 border-black/80 rounded-lg focus-within:border-black transition-colors">
                                            {socialLinks.map((link, i) => (
                                                <span
                                                    key={i}
                                                    className={`flex items-center gap-1.5 bg-white border rounded-full px-3 py-1 text-[13px] font-medium text-black transition-colors ${
                                                        linkStatuses[i] === "success"
                                                            ? "border-green-500 bg-green-50"
                                                            : linkStatuses[i] === "error"
                                                              ? "border-red-500 bg-red-50"
                                                              : "border-black/30"
                                                    }`}
                                                >
                                                    {linkStatuses[i] === "verifying" && (
                                                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                    )}
                                                    {linkStatuses[i] === "success" && (
                                                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-green-600">
                                                            <path d="M13.3333 4L5.99996 11.3333L2.66663 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                    {linkStatuses[i] === "error" && (
                                                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-red-600">
                                                            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                                        </svg>
                                                    )}
                                                    <span className="truncate max-w-[120px]">{link}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSocialLink(i)}
                                                        disabled={isSubmitting}
                                                        className="text-black/60 hover:text-black transition-colors disabled:hidden"
                                                        aria-label="Remove link"
                                                    >
                                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                                            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            ))}
                                            <input
                                                id="social"
                                                type="url"
                                                placeholder={socialLinks.length === 0 ? "Add social media URLs" : "Add another..."}
                                                value={socialInput}
                                                onChange={(e) => setSocialInput(e.target.value)}
                                                onKeyDown={handleSocialKeyDown}
                                                onBlur={addSocialLink}
                                                className="flex-1 min-w-[150px] bg-transparent outline-none text-black placeholder:text-black/40 text-[15px] disabled:hidden"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        {errors.socialLinks && (
                                            <p className="mt-1 text-[13px] text-red-700 font-medium tracking-tight">
                                                {errors.socialLinks.message}
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
                                            disabled={isSubmitting || isVerifying}
                                            className="bg-black text-white font-jakarta font-bold text-[17px] px-10 py-3.5 rounded-full border-2 border-black transition-all hover:bg-black/90 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    {isVerifying ? "Verifying..." : "Submitting..."}
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
                                    transition={{ duration: animationDefaults.normal / 1000 }}
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

