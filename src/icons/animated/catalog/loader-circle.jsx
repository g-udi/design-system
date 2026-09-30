// Adapted from lucide-animated/icons/loader-circle.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const G_VARIANTS = {
  normal: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 0.8,
      ease: "linear"
    }
  }
};
const DEFAULT_TRANSITION = {
  type: "spring",
  stiffness: 50,
  damping: 10
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    d="M21 12a9 9 0 1 1-6.219-8.56"
    style={{ transformOrigin: "12px 12px" }}
    transition={DEFAULT_TRANSITION}
    variants={G_VARIANTS}
  />
    </motion.g>;
}
