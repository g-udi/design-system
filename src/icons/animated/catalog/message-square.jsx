// Adapted from lucide-animated/icons/message-square.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const ICON_VARIANTS = {
  normal: {
    scale: 1,
    rotate: 0
  },
  animate: {
    scale: 1.05,
    rotate: [0, -7, 7, 0],
    transition: {
      rotate: {
        duration: 0.5,
        ease: "easeInOut"
      },
      scale: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g animate={controls} variants={ICON_VARIANTS} initial="normal">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </motion.g>;
}
