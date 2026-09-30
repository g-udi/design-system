// Adapted from lucide-animated/icons/folder-plus.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const PATH_VARIANTS = {
  normal: { pathLength: 1, opacity: 1 },
  animate: (custom) => ({
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      delay: custom * 0.1,
      opacity: { delay: custom * 0.1 }
    }
  })
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <motion.path
    animate={controls}
    custom={1}
    d="M12 10v6"
    initial="normal"
    variants={PATH_VARIANTS}
  />
      <motion.path
    animate={controls}
    custom={0}
    d="M9 13h6"
    initial="normal"
    variants={PATH_VARIANTS}
  />
    </motion.g>;
}
