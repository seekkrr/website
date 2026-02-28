"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CloudinaryIcons } from "@/lib/config/assets";

const FloatingIcon = ({
    src,
    alt,
    className = "",
    size = "w-[64px] h-[64px] md:w-[76px] md:h-[76px] lg:w-[84px] lg:h-[84px] xl:w-[96px] xl:h-[96px]",
}: {
    src: string;
    alt: string;
    className?: string;
    size?: string;
}) => {
    return (
        <motion.div
            className={`relative flex items-center justify-center shrink-0 ${size} ${className}`}
            animate={{
                y: [0, -15, 0],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            <div className="relative w-full h-full">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain"
                />
            </div>
        </motion.div>
    );
};

export function BuiltForExplorers() {
    return (
        <section className="w-full bg-theme-beige overflow-hidden pt-6 pb-4 lg:pt-8 lg:pb-6 flex justify-center items-center min-h-[350px] lg:min-h-[450px]">
            <div className="w-full max-w-[1240px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] xl:grid-cols-[1fr_600px_1fr] items-center gap-8 lg:gap-12">

                {/* Mobile Top Icons (Visible < lg) */}
                <motion.div
                    className="flex lg:hidden w-full items-center justify-between px-2 sm:px-12 mb-4"
                    animate={{ x: [-15, 15, -15] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <FloatingIcon src={CloudinaryIcons.lamp} alt="Lamp Icon" />
                    <FloatingIcon src={CloudinaryIcons.compass} alt="Compass Icon" />
                    <FloatingIcon src={CloudinaryIcons.board} alt="Board Icon" />
                </motion.div>

                {/* Left Icons Matrix (Desktop) */}
                <div className="hidden lg:flex flex-col items-center justify-center relative h-[300px] w-full">
                    {/* Top Left (Lamp) - further left */}
                    <div className="absolute top-0 right-[40%] xl:right-[50%]">
                        <FloatingIcon src={CloudinaryIcons.lamp} alt="Lamp Icon" />
                    </div>
                    {/* Middle Left (Compass) - closer to center */}
                    <div className="absolute top-[45%] xl:top-1/2 -translate-y-1/2 right-[10%] xl:right-[15%]">
                        <FloatingIcon src={CloudinaryIcons.compass} alt="Compass Icon" />
                    </div>
                    {/* Bottom Left (Board) - further left */}
                    <div className="absolute bottom-0 right-[40%] xl:right-[50%]">
                        <FloatingIcon src={CloudinaryIcons.board} alt="Board Icon" />
                    </div>
                </div>

                {/* Central Text */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 flex flex-col items-center justify-center text-center mx-auto w-full max-w-[600px]"
                >
                    <h2 className="font-handwriting text-[44px] sm:text-[54px] lg:text-[64px] xl:text-[72px] leading-[1.1] text-black font-bold tracking-wide whitespace-pre-line">
                        {"Built for Explorers,\nnot tourists"}
                    </h2>
                </motion.div>

                {/* Right Icons Matrix */}
                <div className="hidden lg:flex flex-col items-center justify-center relative h-[300px] w-full">
                    {/* Top Right (Kayak) - further right */}
                    <div className="absolute top-0 left-[40%] xl:left-[50%]">
                        <FloatingIcon src={CloudinaryIcons.kayake} alt="Kayak Icon" />
                    </div>
                    {/* Middle Right (Mountain) - closer to center */}
                    <div className="absolute top-[45%] xl:top-1/2 -translate-y-1/2 left-[10%] xl:left-[15%]">
                        <FloatingIcon src={CloudinaryIcons.mountain} alt="Mountain Icon" />
                    </div>
                    {/* Bottom Right (Fire) - further right */}
                    <div className="absolute bottom-0 left-[40%] xl:left-[50%]">
                        <FloatingIcon src={CloudinaryIcons.fire} alt="Fire Icon" />
                    </div>
                </div>

                {/* Mobile Bottom Icons (Visible < lg) */}
                <motion.div
                    className="flex lg:hidden w-full items-center justify-between px-2 sm:px-12 mt-4"
                    animate={{ x: [15, -15, 15] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                    <FloatingIcon src={CloudinaryIcons.kayake} alt="Kayak Icon" />
                    <FloatingIcon src={CloudinaryIcons.mountain} alt="Mountain Icon" />
                    <FloatingIcon src={CloudinaryIcons.fire} alt="Fire Icon" />
                </motion.div>

            </div>
        </section>
    );
}
