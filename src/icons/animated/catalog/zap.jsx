// Adapted from lucide-animated/icons/zap.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const PATH_VARIANTS = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 0.6,
      opacity: { duration: 0.1 }
    }
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      duration: 0.6,
      opacity: { duration: 0.1 }
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
    variants={PATH_VARIANTS}
  />
    </motion.g>;
}
