"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CloudinaryIcons } from "@/lib/config/assets";
import { siteConfig } from "@/lib/config/site";

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
  return (
    <>
      <section className="w-full bg-theme-beige overflow-hidden pt-6 pb-24 lg:pt-8 lg:pb-32 flex justify-center items-center min-h-[350px] lg:min-h-[450px]">
        <div className="w-full max-w-[1240px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] xl:grid-cols-[1fr_600px_1fr] items-center gap-8 lg:gap-12">
          {/* Mobile Top Icons (Visible < lg) */}
          <motion.div
            className="flex lg:hidden w-full items-center justify-between px-2 sm:px-12 mb-4"
            animate={{ x: [-15, 15, -15] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FloatingIcon src={CloudinaryIcons.boat} alt="Boat Icon" />
            <FloatingIcon
              src={CloudinaryIcons.sleepingBag}
              alt="Sleeping Bag Icon"
            />
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
              <FloatingIcon
                src={CloudinaryIcons.sleepingBag}
                alt="Sleeping Bag Icon"
              />
            </div>
            {/* Bottom Left (Blue Tent) - further left */}
            <div className="absolute bottom-0 right-[40%] xl:right-[50%]">
              <FloatingIcon src={CloudinaryIcons.tent} alt="Tent Icon" />
            </div>
          </div>

          {/* Central Call to Action - Google Play Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex items-center justify-center"
          >
            <Link
              href={siteConfig.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity block"
            >
              <img
                src="/assets/images/GetItOnGooglePlay_Badge.svg"
                alt="Get it on Google Play - Google Play is a trademark of Google LLC"
                width="320"
                height="94"
                className="w-full sm:w-80 md:w-96 h-auto"
              />
            </Link>
          </motion.div>

          {/* Right Icons Matrix */}
          <div className="hidden lg:flex flex-col items-center justify-center relative h-[300px] w-full">
            {/* Top Right (Yellow Coffee) - further right */}
            <div className="absolute top-0 left-[40%] xl:left-[50%]">
              <FloatingIcon src={CloudinaryIcons.coffee} alt="Coffee Icon" />
            </div>
            {/* Middle Right (Orange Backpack) - closer to pill */}
            <div className="absolute top-[45%] xl:top-1/2 -translate-y-1/2 left-[10%] xl:left-[15%]">
              <FloatingIcon
                src={CloudinaryIcons.backpack}
                alt="Backpack Icon"
              />
            </div>
            {/* Bottom Right (Blue Balloon) - further right */}
            <div className="absolute bottom-0 left-[40%] xl:left-[50%]">
              <FloatingIcon
                src={CloudinaryIcons.balloon}
                alt="Hot Air Balloon Icon"
              />
            </div>
          </div>

          {/* Mobile Bottom Icons (Visible < lg) */}
          <motion.div
            className="flex lg:hidden w-full items-center justify-between px-2 sm:px-12 mt-4"
            animate={{ x: [15, -15, 15] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <FloatingIcon src={CloudinaryIcons.coffee} alt="Coffee Icon" />
            <FloatingIcon src={CloudinaryIcons.backpack} alt="Backpack Icon" />
            <FloatingIcon
              src={CloudinaryIcons.balloon}
              alt="Hot Air Balloon Icon"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
