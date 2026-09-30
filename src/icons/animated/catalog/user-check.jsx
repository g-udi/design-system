// Adapted from lucide-animated/icons/user-check.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const CHECK_VARIANTS = {
  normal: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      pathLength: { duration: 0.4, ease: "easeInOut" },
      opacity: { duration: 0.4, ease: "easeInOut" }
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <motion.path
    animate={controls}
    d="M16 11L18 13L22 9"
    initial="normal"
    style={{ transformOrigin: "center" }}
    variants={CHECK_VARIANTS}
  />
    </motion.g>;
}
