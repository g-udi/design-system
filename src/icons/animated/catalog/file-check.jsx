// Adapted from lucide-animated/icons/file-check.tsx (MIT). See ../LICENSE.
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <motion.path
    animate={controls}
    d="m9 15 2 2 4-4"
    initial="normal"
    style={{ transformOrigin: "center" }}
    variants={CHECK_VARIANTS}
  />
    </motion.g>;
}
