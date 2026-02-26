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

export function FreedomSection() {
    return (
        <section className="w-full bg-[#FFFFF3] overflow-hidden pt-6 pb-24 lg:pt-8 lg:pb-32 flex justify-center items-center min-h-[350px] lg:min-h-[450px]">
            <div className="w-full max-w-[1240px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] xl:grid-cols-[1fr_600px_1fr] items-center gap-8 lg:gap-12">

                {/* Left Icons Matrix */}
                <div className="hidden lg:flex flex-col items-center justify-center relative h-[300px] w-full">
                    {/* Top Left (Guitar) */}
                    <div className="absolute top-0 right-[40%] xl:right-[50%]">
                        <FloatingIcon src={CloudinaryIcons.guitar} alt="Guitar Icon" />
                    </div>
                    {/* Middle Left (Camera) */}
                    <div className="absolute top-[45%] xl:top-1/2 -translate-y-1/2 right-[10%] xl:right-[15%]">
                        <FloatingIcon src={CloudinaryIcons.camera} alt="Camera Icon" />
                    </div>
                    {/* Bottom Left (Sun) */}
                    <div className="absolute bottom-0 right-[40%] xl:right-[50%]">
                        <FloatingIcon src={CloudinaryIcons.sun} alt="Sun Icon" />
                    </div>
                </div>

                {/* Central Text */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 flex flex-col items-center justify-center text-center mx-auto w-full"
                >
                    <h2 className="font-handwriting text-[28px] sm:text-[34px] lg:text-[40px] xl:text-[44px] leading-[1.2] text-black tracking-normal whitespace-pre-line">
                        <span className="underline decoration-2 underline-offset-4">Freedom</span>{" isn't just having no plan;\nIt's having the right map to the places\neveryone else missed"}
                    </h2>
                </motion.div>

                {/* Right Icons Matrix */}
                <div className="hidden lg:flex flex-col items-center justify-center relative h-[300px] w-full">
                    {/* Top Right (Trees) */}
                    <div className="absolute top-0 left-[40%] xl:left-[50%]">
                        <FloatingIcon src={CloudinaryIcons.trees} alt="Trees Icon" />
                    </div>
                    {/* Middle Right (Binoculars) */}
                    <div className="absolute top-[45%] xl:top-1/2 -translate-y-1/2 left-[10%] xl:left-[15%]">
                        <FloatingIcon src={CloudinaryIcons.binoculars} alt="Binoculars Icon" />
                    </div>
                    {/* Bottom Right (Drink) */}
                    <div className="absolute bottom-0 left-[40%] xl:left-[50%]">
                        <FloatingIcon src={CloudinaryIcons.drink} alt="Drink Icon" />
                    </div>
                </div>

            </div>
        </section>
    );
}
