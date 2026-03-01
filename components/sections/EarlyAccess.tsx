"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { CloudinaryIcons } from "@/lib/config/assets";
import { clientState } from "@/lib/clientState";
import { imageLoadingAnimation } from "@/lib/utils/imageOptimization";

// Dynamic import for RegisterModal - code split automatically
const RegisterModal = dynamic(() => import("@/components/ui/RegisterModal").then(mod => ({ default: mod.RegisterModal })), {
    loading: () => null,
    ssr: false,
});

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
            whileHover={{
                scale: 1.08,
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{
                y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                },
                scale: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                },
            }}
        >
            <div className="relative w-full h-full pointer-events-none">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain"
                    loading="lazy"
                />
            </div>
        </motion.div>
    );
};

export function EarlyAccess() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        // Check if user already registered for early access
        if (clientState.get("earlyAccessRegistered") === "true") {
            setIsRegistered(true);
        }
    }, []);

    const handleSuccess = () => {
        setIsRegistered(true);
    };

    return (
        <>
            <RegisterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
            <section className="w-full bg-theme-beige overflow-hidden pt-6 pb-24 lg:pt-8 lg:pb-32 flex justify-center items-center min-h-[350px] lg:min-h-[450px]">
                <div className="w-full max-w-[1240px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] xl:grid-cols-[1fr_600px_1fr] items-center gap-8 lg:gap-12">

                    {/* Mobile Top Icons (Visible < lg) */}
                    <motion.div
                        className="flex lg:hidden w-full items-center justify-between px-2 sm:px-12 mb-4"
                        animate={{ x: [-15, 15, -15] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <FloatingIcon src={CloudinaryIcons.boat} alt="Boat Icon" />
                        <FloatingIcon src={CloudinaryIcons.sleepingBag} alt="Sleeping Bag Icon" />
                        <FloatingIcon src={CloudinaryIcons.tent} alt="Tent Icon" />
                    </motion.div>

                    {/* Left Icons Matrix (Desktop) */}
                    <div className="hidden lg:flex flex-col items-center justify-center relative h-[300px] w-full">
                        {/* Top Left (Yellow Boat) - further left */}
                        <div className="absolute top-0 right-[40%] xl:right-[50%]">
                            <FloatingIcon src={CloudinaryIcons.boat} alt="Boat Icon" />
                        </div>
                        {/* Middle Left (Orange Sleeping Bag) - closer to pill */}
                        <div className="absolute top-[45%] xl:top-1/2 -translate-y-1/2 right-[10%] xl:right-[15%]">
                            <FloatingIcon src={CloudinaryIcons.sleepingBag} alt="Sleeping Bag Icon" />
                        </div>
                        {/* Bottom Left (Blue Tent) - further left */}
                        <div className="absolute bottom-0 right-[40%] xl:right-[50%]">
                            <FloatingIcon src={CloudinaryIcons.tent} alt="Tent Icon" />
                        </div>
                    </div>

                    {/* Central Call to Action Pill */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative z-10 bg-black text-white rounded-[32px] md:rounded-[40px] px-6 py-5 sm:px-8 md:px-12 md:py-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-12 mx-auto w-[90%] sm:w-full max-w-[600px] shadow-2xl"
                    >
                        {isRegistered ? (
                            <h2 className="font-jakarta text-[18px] sm:text-[24px] lg:text-[28px] xl:text-[32px] font-semibold tracking-tight whitespace-normal text-center sm:whitespace-nowrap">
                                Thank You for your interest!
                            </h2>
                        ) : (
                            <>
                                <h2 className="font-jakarta text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[32px] font-semibold tracking-tight whitespace-normal text-center sm:whitespace-nowrap">
                                    Get Early Access
                                </h2>

                                <motion.button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-white text-black font-jakarta font-bold text-[16px] sm:text-[18px] lg:text-[20px] px-6 py-2 sm:px-8 sm:py-3 rounded-[8px] sm:rounded-[12px] border-[2px] sm:border-[3px] border-black shrink-0"
                                    whileHover={{
                                        y: -4,
                                        boxShadow: "6px 6px 0 var(--color-blue-accent)",
                                    }}
                                    whileTap={{
                                        y: 0,
                                        boxShadow: "2px 2px 0 var(--color-blue-accent)",
                                    }}
                                    style={{
                                        boxShadow: "3px 3px 0 var(--color-blue-accent)",
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                    }}
                                >
                                    Register
                                </motion.button>
                            </>
                        )}
                    </motion.div>

                    {/* Right Icons Matrix */}
                    <div className="hidden lg:flex flex-col items-center justify-center relative h-[300px] w-full">
                        {/* Top Right (Yellow Coffee) - further right */}
                        <div className="absolute top-0 left-[40%] xl:left-[50%]">
                            <FloatingIcon src={CloudinaryIcons.coffee} alt="Coffee Icon" />
                        </div>
                        {/* Middle Right (Orange Backpack) - closer to pill */}
                        <div className="absolute top-[45%] xl:top-1/2 -translate-y-1/2 left-[10%] xl:left-[15%]">
                            <FloatingIcon src={CloudinaryIcons.backpack} alt="Backpack Icon" />
                        </div>
                        {/* Bottom Right (Blue Balloon) - further right */}
                        <div className="absolute bottom-0 left-[40%] xl:left-[50%]">
                            <FloatingIcon src={CloudinaryIcons.balloon} alt="Hot Air Balloon Icon" />
                        </div>
                    </div>

                    {/* Mobile Bottom Icons (Visible < lg) */}
                    <motion.div
                        className="flex lg:hidden w-full items-center justify-between px-2 sm:px-12 mt-4"
                        animate={{ x: [15, -15, 15] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                        <FloatingIcon src={CloudinaryIcons.coffee} alt="Coffee Icon" />
                        <FloatingIcon src={CloudinaryIcons.backpack} alt="Backpack Icon" />
                        <FloatingIcon src={CloudinaryIcons.balloon} alt="Hot Air Balloon Icon" />
                    </motion.div>

                </div>
            </section>
        </>
    );
}
