"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config/site";

export function HeroTripod() {
    return (
        <section className="relative w-full bg-theme-beige pt-32 pb-8 px-6 md:px-12 lg:px-24 flex justify-center">
            {/* Container simulating the rounded stroke card */}
            <div className="relative w-full max-w-[1240px] mx-auto rounded-[32px] border-[3px] border-black bg-theme-beige px-8 pt-12 pb-14 sm:px-12 sm:pt-14 sm:pb-16 lg:px-16 lg:pt-16 lg:pb-16 flex flex-col justify-center shadow-none">

                {/* Left Side: Typography */}
                <div className="flex w-full flex-col z-10 lg:w-[60%] shrink-0 text-left">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="font-jakarta text-[32px] sm:text-[38px] lg:text-[46px] xl:text-[50px] font-bold leading-[1.25] text-black tracking-tight mb-4 lg:mb-8"
                    >
                        Exhausted with planning<br />
                        every step of<br />
                        your Trip?
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative mt-8 sm:mt-12 lg:mt-4 self-start inline-block"
                    >
                        {/* The primary text wrapper */}
                        <div className="relative inline-block mt-2 md:mt-4">
                            <h1 className="font-jakarta text-[32px] sm:text-[44px] md:text-[50px] lg:text-[44px] xl:text-[62px] font-bold leading-[1.1] sm:leading-none text-theme-green [text-shadow:4px_4px_0_var(--color-yellow-accent)] sm:[text-shadow:4px_4px_0_var(--color-yellow-accent)] relative z-10 pb-[10px] md:pb-[14px] xl:whitespace-nowrap">
                                Travel With {siteConfig.name}
                            </h1>

                            {/* Custom underline elements close to text, matching text width exactly */}
                            <div className="absolute bottom-0 left-0 w-full flex flex-col z-0">
                                <div className="w-full h-[2px] bg-theme-green"></div>
                                <div className="w-full h-[4px] bg-theme-yellow mt-[1px]"></div>
                            </div>

                            {/* Stars icon positioned uniquely over the end of the text, outside the underline calculation */}
                            <Image
                                src="/assets/images/Stars.svg"
                                alt="Stars Decoration"
                                width={48}
                                height={48}
                                className="absolute -right-8 md:-right-10 -top-5 md:-top-7 w-10 md:w-12 h-auto z-20 pointer-events-none shrink-0"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Tripod Illustration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="relative mt-8 lg:mt-0 w-full lg:w-auto flex justify-center lg:block lg:absolute lg:bottom-[-35px] lg:right-[-40px] xl:bottom-[-40px] xl:right-[-50px] z-20 pointer-events-none"
                >
                    <Image
                        src="/assets/images/tripod.svg"
                        alt="Travel photographer with tripod"
                        width={460}
                        height={460}
                        className="w-full h-auto max-w-[320px] sm:max-w-[400px] lg:max-w-[380px] xl:max-w-[460px] drop-shadow-[0_15px_15px_rgba(0,0,0,0.1)] object-contain"
                    />
                </motion.div>

            </div>
        </section>
    );
}
