"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CloudinaryIcons } from "@/lib/config/assets";
import cloudinaryLoader from "@/lib/cloudinaryLoader";

export function HeroCreator() {
    return (
        <section className="relative w-full bg-theme-beige pt-32 pb-0 px-6 md:px-12 lg:px-24 flex justify-center overflow-hidden">
            {/* Main container with premium card aesthetic */}
            <div className="relative w-full max-w-[1240px] mx-auto bg-theme-beige min-h-[400px] lg:min-h-[460px] lg:h-[460px] flex flex-col lg:flex-row items-center overflow-hidden">

                {/* Background SVG border patterns (Responsive) */}
                <div className="absolute inset-0 z-0 pointer-events-none w-full h-full flex items-center justify-center">
                    {/* Desktop/Tablet Border */}
                    <Image
                        src="/assets/misc/border_with_box.svg"
                        alt="Border Decoration"
                        fill
                        className="hidden md:block object-fill w-full h-full"
                        priority
                    />
                    {/* Mobile Border (<= 768px) */}
                    <Image
                        src="/assets/misc/box_border_mobile.svg"
                        alt="Border Decoration"
                        fill
                        className="block md:hidden object-fill w-full h-full"
                        priority
                    />
                </div>

                {/* Left Side: Typography */}
                <div className="relative z-10 flex w-full flex-col lg:w-1/2 shrink-0 text-left pt-5 md:pt-20 pb-4 px-10 sm:px-16 lg:px-0 lg:pl-[160px] xl:pl-[180px] lg:py-0 h-auto lg:h-full justify-center items-start lg:-mt-4">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-0 text-left items-start"
                    >
                        <h1 className="font-jakarta text-[48px] sm:text-[56px] md:text-[62px] lg:text-[66px] xl:text-[74px] font-bold leading-[1.05] text-black tracking-tight drop-shadow-sm">
                            SeekKrr
                        </h1>
                        <h2 className="font-jakarta text-[48px] sm:text-[56px] md:text-[62px] lg:text-[66px] xl:text-[74px] font-bold leading-[1.05] text-black tracking-tight drop-shadow-sm">
                            For
                        </h2>
                        <h3 className="font-handwriting text-[56px] sm:text-[68px] md:text-[76px] lg:text-[84px] xl:text-[94px] font-bold leading-[0.9] text-black drop-shadow-md lg:-ml-1">
                            Creators
                        </h3>
                    </motion.div>
                </div>

                {/* Right Side: Hero Illustration */}
                <div className="relative z-10 flex w-full lg:w-1/2 h-[300px] sm:h-[380px] lg:h-full justify-center lg:justify-end items-end pb-4 lg:pb-[4px] lg:pr-[100px] xl:pr-[120px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[380px] xl:max-w-[420px] h-[95%] lg:h-[88%] xl:h-[92%] flex items-end"
                    >
                        <Image
                            loader={cloudinaryLoader}
                            src={CloudinaryIcons.creatorHero}
                            alt="Creator Hero Illustration"
                            fill
                            className="object-contain object-bottom drop-shadow-[0_12px_12px_rgba(0,0,0,0.1)] gpu-accelerated"
                            sizes="(max-w-width: 768px) 100vw, (max-w-width: 1200px) 50vw, 33vw"
                            priority
                        />
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
