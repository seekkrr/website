/**
 * Loading Fallback Component for Lazy-Loaded Modals
 * Provides smooth skeleton loading during code chunk completion
 */

import { motion } from "framer-motion";

export function ModalLoadingFallback() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-12 h-12 rounded-full border-4 border-transparent border-t-beige-300 border-r-beige-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

/**
 * Minimal loading skeleton - even lighter than ModalLoadingFallback
 */
export function SkeletonLoader() {
  return (
    <motion.div
      className="w-8 h-8 rounded-full bg-beige-200"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/**
 * Loading state with premium feel using framer-motion
 */
export function PremiumLoadingState() {
  const pulseVariants = {
    initial: { opacity: 0.4 },
    animate: {
      opacity: [0.4, 0.7, 0.4],
      scale: [1, 1.02, 1],
    },
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-blue-400"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}
