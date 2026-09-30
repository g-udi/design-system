// Adapted from lucide-animated/icons/moon.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const SVG_VARIANTS = {
  normal: {
    rotate: 0
  },
  animate: {
    rotate: [0, -10, 10, -5, 5, 0]
  }
};
const SVG_TRANSITION = {
  duration: 1.2,
  ease: "easeInOut"
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g
    animate={controls}
    transition={SVG_TRANSITION}
    variants={SVG_VARIANTS}
    initial="normal"
  >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </motion.g>;
}
