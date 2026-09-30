// Adapted from lucide-animated/icons/trending-down.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const SVG_VARIANTS = {
  animate: {
    x: 0,
    y: 0,
    translateX: [0, 2, 0],
    translateY: [0, 2, 0],
    transition: {
      duration: 0.5
    }
  }
};
const PATH_VARIANTS = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 }
    }
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 }
    }
  }
};
const ARROW_VARIANTS = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      opacity: { duration: 0.1, delay: 0.3 }
    }
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [0.5, 0],
    transition: {
      delay: 0.3,
      duration: 0.3,
      opacity: { duration: 0.1, delay: 0.3 }
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g animate={controls} initial="normal" variants={SVG_VARIANTS}>
      <motion.polyline
    animate={controls}
    initial="normal"
    points="22 17 13.5 8.5 8.5 13.5 2 7"
    variants={PATH_VARIANTS}
  />
      <motion.polyline
    animate={controls}
    initial="normal"
    points="16 17 22 17 22 11"
    variants={ARROW_VARIANTS}
  />
    </motion.g>;
}
