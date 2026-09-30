// Adapted from lucide-animated/icons/circle-check.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const PATH_VARIANTS = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 0.3,
      opacity: { duration: 0.1 }
    }
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 }
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <circle cx="12" cy="12" r="10" />
      <motion.path animate={controls} d="m9 12 2 2 4-4" initial="normal" variants={PATH_VARIANTS} />
    </motion.g>;
}
