// Adapted from lucide-animated/icons/history.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const ARROW_TRANSITION = {
  type: "spring",
  stiffness: 250,
  damping: 25
};
const ARROW_VARIANTS = {
  normal: {
    rotate: "0deg"
  },
  animate: {
    rotate: "-50deg"
  }
};
const HAND_TRANSITION = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1]
};
const HAND_VARIANTS = {
  normal: {
    rotate: 0,
    originX: "0%",
    originY: "100%"
  },
  animate: {
    rotate: -360,
    originX: "0%",
    originY: "100%"
  }
};
const MINUTE_HAND_TRANSITION = {
  duration: 0.5,
  ease: "easeInOut"
};
const MINUTE_HAND_VARIANTS = {
  normal: {
    rotate: 0,
    originX: "0%",
    originY: "0%"
  },
  animate: {
    rotate: -45,
    originX: "0%",
    originY: "0%"
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.g animate={controls} transition={ARROW_TRANSITION} variants={ARROW_VARIANTS}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </motion.g>
      <motion.line
    animate={controls}
    initial="normal"
    transition={HAND_TRANSITION}
    variants={HAND_VARIANTS}
    x1="12"
    x2="12"
    y1="12"
    y2="7"
  />
      <motion.line
    animate={controls}
    initial="normal"
    transition={MINUTE_HAND_TRANSITION}
    variants={MINUTE_HAND_VARIANTS}
    x1="12"
    x2="16"
    y1="12"
    y2="14"
  />
    </motion.g>;
}
