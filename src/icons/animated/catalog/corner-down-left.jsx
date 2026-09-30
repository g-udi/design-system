// Adapted from lucide-animated/icons/corner-down-left.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const STRETCH_VARIANTS = {
  normal: { scaleX: 1, x: 0, opacity: 1 },
  animate: {
    scaleX: [1, 1.15, 1],
    x: [0, -2, 0],
    transition: {
      duration: 0.45,
      ease: "easeInOut"
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g animate={controls} initial="normal" variants={STRETCH_VARIANTS}>
      <path d="M4 15h12a4 4 0 0 0 4-4V4" />
      <path d="m9 20-5-5 5-5" />
    </motion.g>;
}
