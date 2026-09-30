// Adapted from lucide-animated/icons/underline.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const VARIANTS = {
  normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    pathOffset: [1, 0]
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    d="M6 4v6a6 6 0 0 0 12 0V4"
    transition={{ duration: 0.3 }}
    variants={VARIANTS}
  />
      <motion.line
    animate={controls}
    transition={{
      delay: 0.2,
      duration: 0.4
    }}
    variants={VARIANTS}
    x1="4"
    x2="20"
    y1="20"
    y2="20"
  />
    </motion.g>;
}
