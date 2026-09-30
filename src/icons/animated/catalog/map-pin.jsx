// Adapted from lucide-animated/icons/map-pin.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const SVG_VARIANTS = {
  normal: {
    y: 0
  },
  animate: {
    y: [0, -5, -3],
    transition: {
      duration: 0.5,
      times: [0, 0.6, 1]
    }
  }
};
const CIRCLE_VARIANTS = {
  normal: {
    opacity: 1
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [0.5, 0],
    transition: {
      delay: 0.3,
      duration: 0.5,
      opacity: { duration: 0.1, delay: 0.3 }
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g animate={controls} initial="normal" variants={SVG_VARIANTS}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <motion.circle
    animate={controls}
    cx="12"
    cy="10"
    initial="normal"
    r="3"
    variants={CIRCLE_VARIANTS}
  />
    </motion.g>;
}
