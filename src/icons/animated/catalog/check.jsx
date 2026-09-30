// Adapted from lucide-animated/icons/check.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const PATH_VARIANTS = {
  normal: {
    opacity: 1,
    pathLength: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      opacity: { duration: 0.1 }
    }
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    scale: [0.5, 1],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 }
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    d="M4 12 9 17L20 6"
    initial="normal"
    variants={PATH_VARIANTS}
  />
    </motion.g>;
}
