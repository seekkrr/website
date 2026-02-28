"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CloudinaryIcons } from "@/lib/config/assets";

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

                {/* ── Row 1: WhatYouGet | Maps | Painter ── */}
                <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-3 lg:gap-4 mb-3 lg:mb-4">

                    {/* Box 1 — "What You Get?" */}
                    <Box className="col-span-4 sm:col-span-3 lg:col-span-3 p-5 flex items-center justify-center
                        [box-shadow:5px_5px_0_var(--color-orange-accent)] min-h-[180px] lg:min-h-[220px]">
                        <h3 className="font-handwriting text-[32px] sm:text-[36px] lg:text-[40px] font-bold leading-none
                            [text-shadow:3px_3px_0_var(--color-blue-accent)] tracking-tight">
                            What<br />You<br />Get ?
                        </h3>
                    </Box>

                    {/* Box 2 — Maps: image left, text right */}
                    <Box className="col-span-4 sm:col-span-5 lg:col-span-5 flex flex-row items-center p-4 gap-4
                        min-h-[180px] lg:min-h-[220px]">
                        <div className="relative w-[40%] shrink-0 self-stretch">
                            <Image
                                src={CloudinaryIcons.phoneMap}
                                alt="Maps that guide you"
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 40vw, 180px"
                            />
                        </div>
                        <p className="font-sans text-[16px] lg:text-[18px] leading-snug">
                            <strong>Maps that guide you</strong> to all the best Spots
                        </p>
                    </Box>

                    {/* Box 3 — Painter: image left, text right */}
                    <Box className="col-span-4 sm:col-span-8 lg:col-span-4 flex flex-row items-center p-4 gap-4
                        min-h-[180px] lg:min-h-[220px]">
                        <div className="relative w-[40%] shrink-0 self-stretch">
                            <Image
                                src={CloudinaryIcons.painter}
                                alt="Unique Experiences"
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 40vw, 160px"
                            />
                        </div>
                        <p className="font-sans text-[16px] lg:text-[18px] leading-snug">
                            <strong>Experiences that are different and unique</strong> not popular
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
                                alt="Connect with Community"
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 50vw, 400px"
                            />
                        </div>
                        <p className="font-sans text-[16px] lg:text-[18px] leading-snug">
                            <strong>Connect with the Community!</strong><br />
                            We tell you about the <strong>stories, history, and culture</strong> of
                            the destination
                        </p>
                    </Box>

                    {/* Box 5 — SeekKrr */}
                    <Box className="col-span-4 sm:col-span-8 lg:col-span-4 !bg-theme-blue p-5 lg:p-6
                        flex flex-col justify-end
                        [box-shadow:5px_5px_0_var(--color-orange-accent)] min-h-[180px] lg:min-h-[220px]">
                        <div className="relative w-full max-w-[180px] h-[56px] mb-1 pointer-events-none">
                            <Image
                                src={CloudinaryIcons.seekkrrText}
                                alt="SeekKrr"
                                fill
                                className="object-contain"
                                sizes="180px"
                            />
                        </div>
                        <p className="text-white font-sans text-[15px] lg:text-[17px] leading-snug">
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
                                alt="Capture the trip"
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 40vw, 140px"
                            />
                        </div>
                        <p className="font-sans text-[15px] lg:text-[16px] leading-snug">
                            <strong>Capture the trip,</strong> with fun{" "}
                            <strong>milestones</strong> that you complete on the way
                        </p>
                    </Box>

                    {/* Box 7 — Spiritual / Orange */}
                    <Box className="col-span-4 sm:col-span-4 lg:col-span-4 !bg-theme-orange p-5 lg:p-6
                        flex flex-col justify-end
                        [box-shadow:5px_5px_0_var(--color-blue-accent)] min-h-[180px] lg:min-h-[200px]">
                        <h3 className="font-handwriting text-[32px] sm:text-[36px] lg:text-[40px] font-bold leading-none text-white 
                            [text-shadow:2px_2px_0_var(--color-yellow-accent)]">
                            Spiritual Culinary Offbeat History and more . . .
                        </h3>
                        <p className="font-sans text-white text-[14px] lg:text-[16px] leading-snug font-medium">
                            Find quests based on your Travel preferences
                        </p>
                    </Box>

                    {/* Box 8 — Routes: image left, text right */}
                    <Box className="col-span-4 sm:col-span-8 lg:col-span-4 flex flex-row items-center p-4 gap-4
                        min-h-[180px] lg:min-h-[200px]">
                        <div className="relative w-[40%] shrink-0 self-stretch">
                            <Image
                                src={CloudinaryIcons.route}
                                alt="Vetted Routes"
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 40vw, 140px"
                            />
                        </div>
                        <p className="font-sans text-[15px] lg:text-[16px] leading-snug">
                            <strong>Vetted Routes</strong> so you feel safe when traveling
                        </p>
                    </Box>
                </div>

            </div>
        </section>
    );
}
