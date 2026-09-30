// Adapted from lucide-animated/icons/chart-line.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const VARIANTS = {
  normal: {
    pathLength: 1,
    opacity: 1
  },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      delay: 0.15,
      duration: 0.3,
      opacity: { delay: 0.1 }
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <motion.path animate={controls} d="m7 13 3-3 4 4 5-5" variants={VARIANTS} />
    </motion.g>;
}
