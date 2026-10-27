"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GoogleIcon } from "@/components/collabs/GoogleHandoffLink";
import { trackEvent } from "@/lib/analytics";
import { portalLinks } from "@/lib/config/site";

/** "Register Now → Continue with Google": sign-up (Google sign-in + details) happens in the Partner Portal. */
export function CreatorRegister() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative w-full bg-theme-beige px-4 md:px-8 lg:px-12 pt-4 md:pt-6 pb-10 sm:pb-14 flex flex-col items-center">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-black text-white rounded-[32px] sm:rounded-[40px] px-6 py-5 sm:px-8 sm:py-4 md:px-12 md:py-5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10 max-w-fit mx-auto shadow-2xl mt-0"
      >
        <h2 className="font-jakarta text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold tracking-tight whitespace-nowrap pt-[2px]">
          Register Now &rarr;
        </h2>
        <motion.a
          href={portalLinks.creatorApply}
          onClick={() => trackEvent("creator_signup_handoff", { source: "creators_steps" })}
          className="inline-flex items-center gap-2.5 bg-white text-black font-jakarta font-bold text-[16px] sm:text-[18px] lg:text-[20px] pl-3 pr-5 py-2.5 sm:pl-4 sm:pr-7 sm:py-3 rounded-[12px] border-[3px] border-black shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          whileHover={
            reduceMotion
              ? undefined
              : { y: -4, boxShadow: "6px 6px 0 var(--color-blue-accent)" }
          }
          whileTap={
            reduceMotion
              ? undefined
              : { y: 0, boxShadow: "2px 2px 0 var(--color-blue-accent)" }
          }
          style={{
            boxShadow: "3px 3px 0 var(--color-blue-accent)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <GoogleIcon className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
          Continue with Google
        </motion.a>
      </motion.div>
    </section>
  );
}
