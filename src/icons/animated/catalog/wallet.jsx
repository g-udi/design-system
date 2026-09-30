// Adapted from lucide-animated/icons/wallet.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const VARIANTS = {
  normal: {
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  animate: {
    y: [0, -3, 0],
    rotate: [0, -4, 0],
    transition: {
      duration: 0.55,
      ease: "easeInOut",
      times: [0, 0.45, 1]
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g
    animate={controls}
    initial="normal"
    style={{ transformOrigin: "12px 12px" }}
    variants={VARIANTS}
  >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </motion.g>;
}
