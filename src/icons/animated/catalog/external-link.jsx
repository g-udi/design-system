// Adapted from lucide-animated/icons/external-link.tsx (MIT). See ../LICENSE.
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
    scale: [1, 0.92, 1],
    translateX: [0, 2, 0],
    translateY: [0, -2, 0],
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
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <motion.g animate={controls} variants={ARROW_VARIANTS}>
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
      </motion.g>
    </motion.g>;
}
