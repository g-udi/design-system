// Adapted from lucide-animated/icons/coffee.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const PATH_VARIANTS = {
  normal: {
    y: 0,
    opacity: 1
  },
  animate: (custom) => ({
    y: -3,
    opacity: [0, 1, 0],
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 1.5,
      ease: "easeInOut",
      delay: 0.2 * custom
    }
  })
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g style={{ overflow: "visible" }} initial="normal">
      <motion.path animate={controls} custom={0.2} d="M10 2v2" variants={PATH_VARIANTS} />
      <motion.path animate={controls} custom={0.4} d="M14 2v2" variants={PATH_VARIANTS} />
      <motion.path animate={controls} custom={0} d="M6 2v2" variants={PATH_VARIANTS} />
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
    </motion.g>;
}
