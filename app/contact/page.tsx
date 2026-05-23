"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { submitQuery } from "@/lib/api";
import { clientState } from "@/lib/clientState";
import { useClientStatePolling } from "@/lib/hooks/useClientStatePolling";
import { stripTags } from "@/lib/utils";

const contactSchema = z
  .object({
    name: z
      .string()
      .transform((v) => stripTags(v).trim())
      .refine(
        (val) => val.length >= 2 && val.length <= 100,
        "Name must be 2-100 characters"
      ),
    email: z
      .string()
      .transform((v) => stripTags(v).trim().toLowerCase())
      .optional()
      .refine(
        (val) => !val || /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(val),
        "Enter a valid email address"
      ),
    phone: z
      .string()
      .transform((v) => stripTags(v).trim())
      .optional()
      .refine(
        (val) => !val || /^[+]?[\d\s\-()]{5,20}$/.test(val),
        "Please enter a valid phone number (e.g. +91 9875543210 or 098-7554-3210)"
      ),
    message: z
      .string()
      .transform((v) => stripTags(v).trim())
      .refine(
        (val) => val.length >= 10 && val.length <= 5000,
        "Message must be 10-5000 characters"
      ),
  })
  .refine((data) => data.email || data.phone, {
    message: "Please provide at least an email or phone number",
    path: ["email"],
  });

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactUsPage() {
  const {
    hasState: isSuccess,
    isChecking: isCheckingState,
    forceCheck,
  } = useClientStatePolling("contactSubmitted");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setSubmitError("");
      const result = await submitQuery({
        name: data.name || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        message: data.message,
      });

      if (result && result.message) {
        clientState.set("contactSubmitted", "true", 1 / 1440);
        forceCheck(); // Immediately sync UI without waiting for next poll
        reset();
      } else {
        setSubmitError("Failed to submit query.");
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  return (
    <div className="min-h-screen bg-theme-beige font-jakarta pt-32 pb-16 px-6 sm:px-12 lg:px-24">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-black tracking-tight">
          Contact Us
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left Column - Handwriting Text */}
        <div className="flex flex-col justify-start h-full pt-8 md:pt-16">
          <p className="font-handwriting text-[2.5rem] md:text-[3.5rem] leading-[1.1] text-black flex flex-col">
            <span>Questions,</span>
            <span>Suggestions,</span>
            <span>Exclusive Discounts</span>
            <span>and more!</span>
          </p>
        </div>

        {/* Right Column - Form */}
        <div className="bg-theme-beige border-2 border-black rounded-[2rem] p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.05)] font-sans">
          {!isSuccess && !isCheckingState && (
            <h2 className="text-2xl sm:text-3xl text-gray-700 font-light mb-8">
              We're here to help
            </h2>
          )}

          {isCheckingState ? (
            <div className="flex justify-center items-center h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : isSuccess ? (
            <div className="bg-transparent p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[300px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-[1.5rem] sm:text-[1.8rem] md:text-[2rem] font-medium text-black text-center text-balance leading-snug">
                Thank you for
                <br />
                reaching out,
                <br />
                we will answer your
                <br />
                query
                <br />
                shortly
              </h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {submitError && (
                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                  {submitError}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full border-b border-gray-400 bg-transparent py-2 text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Mobile (optional) */}
              <div className="space-y-1">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-black mt-4"
                >
                  Mobile (optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your mobile number"
                  className="w-full border-b border-gray-400 bg-transparent py-2 text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black mt-4"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="abc@gmail.com"
                  className="w-full border-b border-gray-400 bg-transparent py-2 text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-black mt-4 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Let us know how we can help!"
                  className="w-full border border-gray-400 rounded-[1rem] bg-transparent p-4 text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white px-12 py-3 rounded-full font-medium min-w-[200px] flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
