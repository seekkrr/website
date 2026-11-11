"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CloudinaryIcons } from "@/lib/config/assets";
import { siteConfig } from "@/lib/config/site";

/*
 * Who each box is for, by text colour: creators in orange, businesses in
 * blue, and the boxes for both in black. The two colours are deeper cuts of
 * the theme's orange and blue, so the text stays readable (4.5:1 or better
 * on the page background).
 */
const FOR_CREATORS = "text-[#D4400F]";
const FOR_BUSINESSES = "text-[#4A5FE0]";
const FOR_BOTH = "text-black";

/* ------------------------------------------------------------------ */
/*  Reusable animated box wrapper                                     */
/* ------------------------------------------------------------------ */
const Box = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`border-[1.5px] border-black/80 rounded-[18px] overflow-hidden bg-theme-beige
            transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${className}`}
    >
        {children}
    </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */
export function WhatYouGet() {
    return (
        <section className="w-full bg-theme-beige py-3 lg:py-5 overflow-hidden text-black relative">
            <div className="w-full max-w-[1240px] mx-auto px-4 lg:px-8">

                {/* ── Row 1: Win-win | Maps | Painter ── */}
                <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-3 lg:gap-4 mb-3 lg:mb-4">

                    {/* Box 1 — "The Win-win situation" */}
                    <Box className="col-span-4 sm:col-span-3 lg:col-span-3 p-5 flex items-center justify-center
                        [box-shadow:5px_5px_0_var(--color-orange-accent)] min-h-[180px] lg:min-h-[220px]">
                        <h2 className="font-handwriting text-[44px] lg:text-[56px] leading-[1] text-center
                            [text-shadow:3px_3px_0_var(--color-blue-accent)] tracking-tight">
                            The<br />Win-win<br />situation
                        </h2>
                    </Box>

                    {/* Box 2 — Maps: image left, text right */}
                    <Box className="col-span-4 sm:col-span-5 lg:col-span-5 flex flex-row items-center p-4 gap-4
                        min-h-[180px] lg:min-h-[220px]">
                        <div className="relative w-[40%] shrink-0 self-stretch">
                            <Image
                                src={CloudinaryIcons.phoneMap}
                                alt="A map of local businesses offering collabs"
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 40vw, 180px"
                            />
                        </div>
                        <p className={`font-sans text-[16px] lg:text-[18px] leading-snug ${FOR_CREATORS}`}>
                            <strong>Discover local businesses</strong> offering collabs on the Map
                        </p>
                    </Box>

                    {/* Box 3 — Painter: image left, text right */}
                    <Box className="col-span-4 sm:col-span-8 lg:col-span-4 flex flex-row items-center p-4 gap-4
                        min-h-[180px] lg:min-h-[220px]">
                        <div className="relative w-[40%] shrink-0 self-stretch">
                            <Image
                                src={CloudinaryIcons.painter}
                                alt="Stays, cafés and experiences"
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 40vw, 160px"
                            />
                        </div>
                        <p className={`font-sans text-[16px] lg:text-[18px] leading-snug ${FOR_CREATORS}`}>
                            <strong>Pick and choose</strong> stays, cafés and experiences
                        </p>
                    </Box>
                </div>

                {/* ── Row 2: Community | SeekKrr ── */}
                <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-3 lg:gap-4 mb-3 lg:mb-4">

                    {/* Box 4 — Community: image left, text right */}
                    <Box className="col-span-4 sm:col-span-8 lg:col-span-8 flex flex-row items-center p-4 lg:p-5 gap-4 lg:gap-6
                        min-h-[180px] lg:min-h-[220px]">
                        <div className="relative w-[50%] lg:w-[55%] shrink-0 self-stretch">
                            <Image
                                src={CloudinaryIcons.conversation}
                                alt="People talking about a local business"
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 50vw, 400px"
                            />
                        </div>
                        <p className={`font-sans text-[16px] lg:text-[18px] leading-snug ${FOR_BUSINESSES}`}>
                            <strong>Word of mouth for Businesses</strong>, get people talking about you
                        </p>
                    </Box>

                    {/* Box 5 — SeekKrr (for both) */}
                    <Box className="col-span-4 sm:col-span-8 lg:col-span-4 p-5 lg:p-6
                        flex flex-col items-center justify-center text-center
                        [box-shadow:5px_5px_0_var(--color-orange-accent)] min-h-[180px] lg:min-h-[220px]">
                        <div className="relative w-full max-w-[180px] h-[56px] mb-1 pointer-events-none">
                            <Image
                                src={CloudinaryIcons.seekkrrText}
                                alt={siteConfig.name}
                                fill
                                className="object-contain"
                                sizes="180px"
                            />
                        </div>
                        <p className="text-black/70 text-xs mb-3 font-sans font-semibold">/~To -Seek~/</p>
                        <p className={`font-sans text-[15px] lg:text-[17px] leading-snug ${FOR_BOTH}`}>
                            You <strong>Focus on Exploring</strong>, We focus on{" "}
                            <strong>When, How and Where</strong>
                        </p>
                    </Box>
                </div>

                {/* ── Row 3: Photographer | Spiritual | Routes ── */}
                <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-3 lg:gap-4">

                    {/* Box 6 — Photographer: image left, text right */}
                    <Box className="col-span-4 sm:col-span-4 lg:col-span-4 flex flex-row items-center p-4 gap-4
                        min-h-[180px] lg:min-h-[200px]">
                        <div className="relative w-[40%] shrink-0 self-stretch">
                            <Image
                                src={CloudinaryIcons.photographer}
                                alt="A creator shooting on the trail"
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 40vw, 140px"
                            />
                        </div>
                        <p className={`font-sans text-[16px] lg:text-[18px] leading-snug ${FOR_BOTH}`}>
                            <strong>Creators shoot</strong>, <strong>Businesses host</strong>, We handle the rest.
                        </p>
                    </Box>

                    {/* Box 7 — No hassle (for both) */}
                    <Box className="col-span-4 sm:col-span-4 lg:col-span-4 p-5 lg:p-6
                        flex flex-col justify-center text-center
                        [box-shadow:5px_5px_0_var(--color-blue-accent)] min-h-[180px] lg:min-h-[200px]">
                        <p className={`font-handwriting text-[28px] lg:text-[34px] leading-[1.1] mb-4
                            [text-shadow:2px_2px_0_var(--color-yellow-accent)] ${FOR_BOTH}`}>
                            No Hassle, no <span className="whitespace-nowrap">to-and-fro</span> DMs
                        </p>
                        <p className={`font-sans text-[14px] lg:text-[16px] leading-snug font-medium ${FOR_BOTH}`}>
                            Clear requirements, creative independence
                        </p>
                    </Box>

                    {/* Box 8 — Routes: image left, text right */}
                    <Box className="col-span-4 sm:col-span-8 lg:col-span-4 flex flex-row items-center p-4 gap-4
                        min-h-[180px] lg:min-h-[200px]">
                        <div className="relative w-[40%] shrink-0 self-stretch">
                            <Image
                                src={CloudinaryIcons.route}
                                alt="Verified check-ins"
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 40vw, 140px"
                            />
                        </div>
                        <p className={`font-sans text-[16px] lg:text-[18px] leading-snug ${FOR_BUSINESSES}`}>
                            <strong>Verified check-ins</strong>
                        </p>
                    </Box>
                </div>

            </div>
        </section>
    );
}
