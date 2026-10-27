"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CloudinaryIcons } from "@/lib/config/assets";

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
  },
];

/** Quests: how a creator's spots become an adventure for their audience. */
export function CreatorSteps() {
  return (
    <section className="relative w-full bg-theme-beige px-4 md:px-8 lg:px-12 pb-12 lg:pb-20 pt-10 md:pt-14 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-10">
        <h3 className="font-jakarta text-[18px] md:text-[22px] lg:text-[24px] font-medium text-black mb-2">
          Also for creators · Quests
        </h3>
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
      <div className="w-full max-w-[1240px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mx-auto px-0 sm:px-6 md:px-0">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
              y: -8,
              boxShadow: "0 16px 32px rgba(0,0,0,0.08)",
              transition: {
                type: "spring",
                stiffness: 350,
                damping: 25,
              },
            }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            className="bg-white rounded-[24px] border-[1.5px] border-black flex flex-col justify-between items-center pt-5 sm:pt-6 lg:pt-8 pb-0 overflow-hidden h-[260px] sm:h-full relative cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
          >
            <h4 className="font-sans text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium text-center text-black leading-[1.25] mb-2 sm:mb-4 lg:mb-6 max-w-[95%] px-2 sm:px-4 lg:px-6">
              {step.title}
            </h4>
            <div className="relative w-full flex-1 flex flex-col items-center mx-0 px-0 justify-end mt-auto -mb-[2px]">
              <Image
                src={step.image}
                alt={step.title}
                width={400}
                height={400}
                className="w-full h-auto object-contain object-bottom sm:mt-auto sm:-mb-1"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
