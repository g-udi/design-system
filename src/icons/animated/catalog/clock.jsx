// Adapted from lucide-animated/icons/clock.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
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
    rotate: 360,
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
    originY: "100%"
  },
  animate: {
    rotate: 45,
    originX: "0%",
    originY: "100%"
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <circle cx="12" cy="12" r="10" />
      <motion.line
    animate={controls}
    initial="normal"
    transition={HAND_TRANSITION}
    variants={HAND_VARIANTS}
    x1="12"
    x2="12"
    y1="12"
    y2="6"
  />
      <motion.line
    animate={controls}
    initial="normal"
    transition={MINUTE_HAND_TRANSITION}
    variants={MINUTE_HAND_VARIANTS}
    x1="12"
    x2="16"
    y1="12"
    y2="12"
  />
    </motion.g>;
}
