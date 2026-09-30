// Adapted from lucide-animated/icons/link-2.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const LEFT_VARIANTS = {
  normal: { x: 0 },
  animate: {
    x: [0, -0.7, 0.3, 0],
    transition: {
      duration: 0.6,
      times: [0, 0.4, 0.75, 1],
      ease: "easeInOut"
    }
  }
};
const RIGHT_VARIANTS = {
  normal: { x: 0 },
  animate: {
    x: [0, 0.7, -0.3, 0],
    transition: {
      duration: 0.6,
      times: [0, 0.4, 0.75, 1],
      ease: "easeInOut"
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.g animate={controls} variants={LEFT_VARIANTS}>
        <path d="M9 17H7A5 5 0 0 1 7 7h2" />
        <line x1="8" x2="12" y1="12" y2="12" />
      </motion.g>
      <motion.g animate={controls} variants={RIGHT_VARIANTS}>
        <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
        <line x1="16" x2="12" y1="12" y2="12" />
      </motion.g>
    </motion.g>;
}
