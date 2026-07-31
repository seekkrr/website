"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { CloudinaryIcons } from "@/lib/config/assets";
import { useClientStatePolling } from "@/lib/hooks/useClientStatePolling";

// Dynamic import for CreatorRegisterModal - code split automatically
const CreatorRegisterModal = dynamic(
  () =>
    import("@/components/ui/CreatorRegisterModal").then((mod) => ({
      default: mod.CreatorRegisterModal,
    })),
  {
    loading: () => null,
    ssr: false,
  }
);

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

export function CreatorSteps() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasState: isRegistered, forceCheck } = useClientStatePolling("creatorRegistered");

  return (
    <section className="relative w-full bg-theme-beige px-4 md:px-8 lg:px-12 pb-12 lg:pb-20 pt-4 md:pt-6 flex flex-col items-center">
      <CreatorRegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={forceCheck}
      />

      {/* CTA Pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-black text-white rounded-[32px] sm:rounded-[40px] px-5 py-3 sm:px-8 sm:py-4 md:px-12 md:py-5 flex items-center justify-center gap-4 sm:gap-6 md:gap-10 mb-10 sm:mb-16 max-w-fit mx-auto shadow-2xl mt-0"
      >
        {isRegistered ? (
          <h2 className="font-jakarta text-[18px] sm:text-[24px] lg:text-[28px] xl:text-[32px] font-semibold tracking-tight whitespace-normal text-center sm:whitespace-nowrap pt-[2px]">
            Thank You ! ✨
          </h2>
        ) : (
          <>
            <h2 className="font-jakarta text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold tracking-tight whitespace-nowrap pt-[2px]">
              Register Now &rarr;
            </h2>
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black font-jakarta font-bold text-[14px] sm:text-[18px] lg:text-[20px] px-4 py-2 sm:px-8 sm:py-3 rounded-[8px] sm:rounded-[12px] border-[2px] sm:border-[3px] border-black shrink-0"
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
              Sign Up
            </motion.button>
          </>
        )}
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
