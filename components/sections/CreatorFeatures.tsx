"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CloudinaryIcons } from "@/lib/config/assets";
import cloudinaryLoader from "@/lib/cloudinaryLoader";

export function CreatorFeatures() {
    return (
        <section className="relative w-full bg-theme-beige px-6 md:px-12 lg:px-24 pb-12 lg:pb-24 flex flex-col items-center overflow-hidden">

            {/* Header */}
            <div className="text-center mb-8">
                <h3 className="font-jakarta text-[18px] md:text-[22px] lg:text-[24px] font-medium text-black">
                    So Your Followers Can
                </h3>
                <h2 className="font-handwriting text-[50px] md:text-[60px] lg:text-[72px] font-bold text-black drop-shadow-sm leading-none mt-2">
                    Feel What you Felt!
                </h2>
            </div>

            {/* Bento Grid */}
            <div className="w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-6 mb-12">

                {/* Left Tall Card - Checkpoints */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-transparent rounded-[32px] border-[2px] border-black flex flex-col items-center pt-10 px-6 pb-0 overflow-hidden h-[500px] lg:h-[650px] xl:h-[700px] [box-shadow:6px_6px_0_#FECD36]"
                >
                    <h4 className="font-sans text-[22px] md:text-[24px] lg:text-[28px] font-medium text-center text-black leading-[1.3] mb-8 max-w-[80%] mt-4">
                        They Navigate to all the Spots you mentioned using Maps
                    </h4>
                    <div className="relative w-full flex-1 flex items-end justify-center rounded-b-[24px] overflow-hidden -mb-[2px]">
                        <div className="relative w-[90%] lg:w-[85%] h-[95%]">
                            <Image
                                loader={cloudinaryLoader}
                                src={CloudinaryIcons.creatorCheckpoints}
                                alt="Navigate Spots"
                                fill
                                className="object-contain object-bottom"
                                sizes="(max-w-width: 1024px) 100vw, 33vw"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Top and Bottom Rows */}
                <div className="flex flex-col gap-6">

                    {/* Top Right Wide Card - Baat */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="bg-transparent rounded-[32px] border-[2px] border-black flex flex-col md:flex-row items-center justify-between pt-10 pb-6 lg:py-10 px-8 xl:px-12 h-auto md:h-[350px] lg:h-[313px] xl:h-[338px] [box-shadow:6px_6px_0_#FECD36] gap-6 md:gap-8"
                    >
                        <div className="relative w-full md:w-1/2 h-[220px] lg:h-[180px] xl:h-full flex items-center justify-center">
                            <Image
                                loader={cloudinaryLoader}
                                src={CloudinaryIcons.creatorBaat}
                                alt="Ek Samay ki Baat Hai"
                                fill
                                className="object-contain"
                                sizes="(max-w-width: 768px) 100vw, 33vw"
                            />
                        </div>
                        <div className="w-full md:w-1/2 flex items-center justify-center lg:justify-start pb-4 lg:pb-0 font-medium">
                            <h4 className="font-sans text-[20px] md:text-[22px] lg:text-[26px] xl:text-[28px] text-center md:text-left text-black leading-[1.4] max-w-[90%] lg:max-w-[85%]">
                                Learn about the stories and cultural notes about the destination
                            </h4>
                        </div>
                    </motion.div>

                    {/* Bottom Right Row - Two Square Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[350px] lg:h-[313px] xl:h-[338px]">

                        {/* Bottom Left Square - Milestones */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                            className="bg-transparent rounded-[32px] border-[2px] border-black flex flex-col items-center pt-10 px-6 pb-0 overflow-hidden h-[300px] md:h-full [box-shadow:6px_6px_0_#FECD36]"
                        >
                            <h4 className="font-sans text-[20px] md:text-[22px] lg:text-[24px] font-medium text-center text-black leading-[1.3] mb-6 max-w-[85%] mt-2">
                                Solve and Complete Fun Milestones That You Add
                            </h4>
                            <div className="relative w-full flex-1 flex items-end justify-center rounded-b-[24px] overflow-hidden -mb-[2px]">
                                <div className="relative w-[90%] h-[95%]">
                                    <Image
                                        loader={cloudinaryLoader}
                                        src={CloudinaryIcons.creatorMilestone}
                                        alt="Solve Milestones"
                                        fill
                                        className="object-contain object-bottom"
                                        sizes="(max-w-width: 768px) 100vw, 25vw"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Bottom Right Square - Blue CTA Text */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                            className="bg-[#8398FF] rounded-[24px] border-[2px] border-black flex flex-col items-center justify-center p-8 h-[300px] md:h-full [box-shadow:6px_6px_0_#FECD36]"
                        >
                            <h4 className="font-handwriting text-center text-[#FFFFF3] leading-[1.2] flex flex-col gap-2">
                                <span className="font-normal text-[26px] md:text-[30px] lg:text-[34px] xl:text-[38px] block mb-1">Don't Wait to</span>
                                <span className="font-bold text-[32px] md:text-[36px] lg:text-[40px] xl:text-[46px] block">Give your Audience The Experience They Seek</span>
                            </h4>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
                <h3 className="font-jakarta text-[18px] md:text-[22px] lg:text-[24px] font-medium text-black">
                    And You Earn
                </h3>
                <h2 className="font-handwriting text-[50px] md:text-[60px] lg:text-[72px] font-bold text-black drop-shadow-sm leading-none mt-2">
                    With Every Quest Sold
                </h2>
            </div>

        </section>
    );
}
