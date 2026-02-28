"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CloudinaryIcons } from "@/lib/config/assets";

export function TheSeekKrrWay() {
    return (
        <section className="w-full bg-theme-beige overflow-hidden flex flex-col items-center justify-center -mt-12 sm:-mt-20 lg:-mt-32 mb-0 lg:mb-4 relative z-20 pointer-events-none text-center">
            {/* pointer-events-none added to section so it doesn't block scroll but we'll enable it on inner contents if needed */}
            <div className="w-full max-w-[1240px] mx-auto px-2 lg:px-4 flex flex-col items-center gap-0 pointer-events-auto">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 flex flex-col items-center justify-center text-center mx-auto w-full mb-1 sm:mb-2 lg:mb-4"
                    style={{ willChange: "transform, opacity" }}
                >
                    <h2
                        className="font-jakarta text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.1] font-semibold tracking-wide whitespace-pre-line text-theme-green [-webkit-text-stroke:1px_black] [text-shadow:4px_4px_0_var(--color-yellow-accent)]"
                    >
                        {"The SeekKrr Way"}
                    </h2>
                </motion.div>

                {/* Images */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="w-full flex justify-center"
                    style={{ willChange: "transform, opacity" }}
                >
                    {/* Desktop Image */}
                    <div className="hidden md:block w-full max-w-[1140px]">
                        <Image
                            src={CloudinaryIcons.blackboardDesktop}
                            alt="The SeekKrr Way Desktop"
                            width={1140}
                            height={374}
                            className="w-full h-auto drop-shadow-xl"
                            priority
                        />
                    </div>

                    {/* Mobile Image */}
                    <div className="block md:hidden w-full max-w-[500px]">
                        <Image
                            src={CloudinaryIcons.blackboardMobile}
                            alt="The SeekKrr Way Mobile"
                            width={500}
                            height={1187}
                            className="w-full h-auto drop-shadow-xl"
                            priority
                        />
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
