// Adapted from lucide-animated/icons/arrow-up-right.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const ARROW_VARIANTS = {
  normal: {
    scale: 1,
    translateX: 0,
    translateY: 0
  },
  animate: {
    scale: [1, 0.85, 1],
    translateX: [0, -4, 0],
    translateY: [0, 4, 0],
    originX: 1,
    originY: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.g animate={controls} variants={ARROW_VARIANTS}>
        <path d="M7 7H17" />
        <path d="M17 7V17" />
        <path d="M7 17L17 7" />
      </motion.g>
    </motion.g>;
}
