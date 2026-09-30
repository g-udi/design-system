"use client";
import { motion } from "framer-motion";
export function AnimatedRefreshCwPaths({ active }) {
  return <motion.g
    initial={{ rotate: 0 }}
    animate={{ rotate: active ? 50 : 0 }}
    style={{ transformOrigin: "12px 12px" }}
    transition={active ? {
      type: "spring",
      stiffness: 250,
      damping: 25,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 0.35
    } : { duration: 0 }}
  >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </motion.g>;
}
