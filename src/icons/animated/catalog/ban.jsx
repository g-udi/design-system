// Adapted from lucide-animated/icons/ban.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const CIRCLE_VARIANTS = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 0.3,
      opacity: { duration: 0.1 }
    }
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 }
    }
  }
};
const LINE_VARIANTS = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 0.3,
      opacity: { duration: 0.1 }
    }
  },
  slash: () => ({
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 }
    }
  })
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.circle
    animate={controls}
    cx="12"
    cy="12"
    initial="normal"
    r="10"
    variants={CIRCLE_VARIANTS}
  />
      <motion.path
    animate={controls}
    d="m4.9 4.9 14.2 14.2"
    initial="normal"
    variants={LINE_VARIANTS}
  />
    </motion.g>;
}
