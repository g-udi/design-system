// Adapted from lucide-animated/icons/mic.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const CAPSULE_VARIANTS = {
  normal: { y: 0 },
  animate: {
    y: [0, -3, 0, -2, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g overflow="visible" initial="normal">
      <path d="M12 19v3" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <motion.rect
    animate={controls}
    height="13"
    rx="3"
    variants={CAPSULE_VARIANTS}
    width="6"
    x="9"
    y="2"
  />
    </motion.g>;
}
