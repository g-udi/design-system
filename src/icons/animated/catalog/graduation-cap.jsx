// Adapted from lucide-animated/icons/graduation-cap.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const CAP_VARIANTS = {
  normal: {
    rotate: 0
  },
  animate: {
    y: [0, -2, 0],
    rotate: [0, -2, 2, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};
const TASSEL_VARIANTS = {
  normal: { rotate: 0 },
  animate: {
    rotate: [0, 15, -10, 5, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
      delay: 0.1
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.g animate={controls} style={{ transformOrigin: "12px 12px" }} variants={CAP_VARIANTS}>
        <path d="M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />

        <motion.path
    d="M22 10v6"
    style={{
      transformBox: "fill-box",
      transformOrigin: "top center"
    }}
    variants={TASSEL_VARIANTS}
  />
      </motion.g>
    </motion.g>;
}
