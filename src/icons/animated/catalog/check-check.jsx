// Adapted from lucide-animated/icons/check-check.tsx (MIT). See ../LICENSE.
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
  animate: (custom) => ({
    opacity: [0, 1],
    pathLength: [0, 1],
    scale: [0.5, 1],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
      delay: 0.1 * custom
    }
  })
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    custom={0}
    d="M2 12 7 17L18 6"
    initial="normal"
    variants={PATH_VARIANTS}
  />
      <motion.path
    animate={controls}
    custom={1}
    d="M13 16L14.5 17.5L22 10"
    initial="normal"
    variants={PATH_VARIANTS}
  />
    </motion.g>;
}
