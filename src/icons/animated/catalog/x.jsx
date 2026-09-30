// Adapted from lucide-animated/icons/x.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const PATH_VARIANTS = {
  normal: {
    opacity: 1,
    pathLength: 1
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1]
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path animate={controls} d="M18 6 6 18" variants={PATH_VARIANTS} />
      <motion.path
    animate={controls}
    d="m6 6 12 12"
    transition={{ delay: 0.2 }}
    variants={PATH_VARIANTS}
  />
    </motion.g>;
}
