// Adapted from lucide-animated/icons/italic.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const LINE_VARIANTS = {
  normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    pathOffset: [1, 0]
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.line
    animate={controls}
    transition={{ duration: 0.2 }}
    variants={LINE_VARIANTS}
    x1="19"
    x2="10"
    y1="4"
    y2="4"
  />
      <motion.line
    animate={controls}
    transition={{ duration: 0.2 }}
    variants={LINE_VARIANTS}
    x1="14"
    x2="5"
    y1="20"
    y2="20"
  />
      <motion.line
    animate={controls}
    transition={{
      delay: 0.1,
      duration: 0.4
    }}
    variants={{
      normal: { pathLength: 1, pathOffset: 0 },
      animate: {
        pathLength: [0, 1],
        pathOffset: [1, 0]
      }
    }}
    x1="15"
    x2="9"
    y1="4"
    y2="20"
  />
    </motion.g>;
}
