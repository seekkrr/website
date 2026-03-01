"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CloudinaryIcons } from "@/lib/config/assets";
import cloudinaryLoader from "@/lib/cloudinaryLoader";
import { RegisterModal } from "@/components/ui/RegisterModal";

const steps = [
    {
        title: "Capture your best Experiences and Places",
        image: CloudinaryIcons.creatorBox1,
    },
    {
        title: "Login into SeekKrr's creator Portal",
        image: CloudinaryIcons.creatorBox2,
    },
    {
        title: "Add spots that your audience should visit",
        image: CloudinaryIcons.creatorBox3,
    },
    {
        title: "Sit Back as we turn it into an adventure",
        image: CloudinaryIcons.creatorBox4,
    }
];

export function CreatorSteps() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="relative w-full bg-theme-beige px-6 md:px-12 lg:px-24 pb-12 lg:pb-20 flex flex-col items-center">

            <RegisterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* CTA Pill */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 bg-black text-white rounded-[40px] px-8 py-4 md:px-12 md:py-5 flex items-center justify-center gap-6 md:gap-10 mb-12 max-w-fit mx-auto shadow-2xl mt-8"
            >
                <h2 className="font-jakarta text-[24px] md:text-[28px] lg:text-[32px] font-semibold tracking-tight whitespace-nowrap pt-[2px]">
                    Register Now &rarr;
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-black font-jakarta font-bold text-[18px] lg:text-[20px] px-8 py-3 rounded-[12px] border-[3px] border-black transition-transform hover:-translate-y-1 active:translate-y-0 [box-shadow:4px_4px_0_var(--color-blue-accent)] hover:[box-shadow:6px_6px_0_var(--color-blue-accent)] active:[box-shadow:2px_2px_0_var(--color-blue-accent)] shrink-0"
                >
                    Sign Up
                </button>
            </motion.div>

            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="font-handwriting text-[50px] md:text-[60px] lg:text-[72px] font-bold text-black drop-shadow-sm leading-none mb-4">
                    Create Travel Experiences
                </h2>
                <div className="flex items-center justify-center gap-3">
                    <h3 className="font-jakarta text-[18px] md:text-[22px] lg:text-[26px] font-medium text-black">
                        That Your Audience Loves
                    </h3>
                    <Image
                        src="/assets/images/Stars.svg"
                        alt="Stars"
                        width={28}
                        height={28}
                        className="w-6 md:w-8 h-auto"
                    />
                </div>
            </div>

            {/* 4 Cards Grid */}
            <div className="w-full max-w-[1100px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                        className="bg-transparent rounded-[24px] border-[1.5px] border-black flex flex-col justify-between items-center pt-8 pb-0 overflow-hidden h-full relative transition-shadow hover:shadow-md"
                    >
                        <h4 className="font-sans text-[18px] md:text-[20px] lg:text-[22px] font-medium text-center text-black leading-[1.3] mb-6 max-w-[95%] px-4 sm:px-6">
                            {step.title}
                        </h4>
                        <div className="relative w-full flex items-end justify-center mt-auto">
                            <Image
                                loader={cloudinaryLoader}
                                src={step.image}
                                alt={step.title}
                                width={500}
                                height={500}
                                className="w-full h-auto object-bottom"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

        </section>
    );
}
