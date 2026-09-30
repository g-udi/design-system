// Adapted from lucide-animated/icons/upload.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const ARROW_VARIANTS = {
  normal: { y: 0 },
  animate: {
    y: -2,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
      mass: 1
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <motion.g animate={controls} variants={ARROW_VARIANTS}>
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </motion.g>
    </motion.g>;
}
