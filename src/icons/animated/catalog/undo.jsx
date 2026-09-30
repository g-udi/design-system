// Adapted from lucide-animated/icons/undo.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { cubicBezier, motion } from "framer-motion";
const CUSTOM_EASING = cubicBezier(0.25, 0.1, 0.25, 1);
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    d="M3 7v6h6"
    transition={{
      duration: 0.6,
      ease: CUSTOM_EASING
    }}
    variants={{
      normal: { translateX: 0, translateY: 0, rotate: 0 },
      animate: {
        translateX: [0, 2.1, 0],
        translateY: [0, -1.4, 0],
        rotate: [0, 12, 0]
      }
    }}
  />
      <motion.path
    animate={controls}
    d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"
    transition={{
      duration: 0.6,
      ease: CUSTOM_EASING
    }}
    variants={{
      normal: { pathLength: 1 },
      animate: { pathLength: [1, 0.8, 1] }
    }}
  />
    </motion.g>;
}
