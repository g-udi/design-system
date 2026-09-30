// Adapted from lucide-animated/icons/trending-up.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const SVG_VARIANTS = {
  animate: {
    x: 0,
    y: 0,
    translateX: [0, 2, 0],
    translateY: [0, -2, 0],
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
    points="22 7 13.5 15.5 8.5 10.5 2 17"
    variants={PATH_VARIANTS}
  />
      <motion.polyline
    animate={controls}
    initial="normal"
    points="16 7 22 7 22 13"
    variants={ARROW_VARIANTS}
  />
    </motion.g>;
}
