// Adapted from lucide-animated/icons/credit-card.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const CARD_VARIANTS = {
  normal: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 18
    }
  },
  animate: {
    x: [0, -4, 1.5, 0],
    transition: {
      duration: 0.7,
      times: [0, 0.4, 0.75, 1],
      ease: "easeInOut"
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g className="overflow-visible" initial="normal">
      <motion.g animate={controls} initial="normal" variants={CARD_VARIANTS}>
        <rect height="14" rx="2" width="20" x="2" y="5" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </motion.g>
    </motion.g>;
}
