// Adapted from lucide-animated/icons/align-right.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const DEFAULT_TRANSITION = {
  type: "spring",
  stiffness: 150,
  damping: 15,
  mass: 0.3
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.line
    animate={controls}
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { x1: 3 },
      animate: { x1: 3 }
    }}
    x1="3"
    x2="21"
    y1="6"
    y2="6"
  />

      <motion.line
    animate={controls}
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { x1: 9 },
      animate: { x1: 5 }
    }}
    x1="9"
    x2="21"
    y1="12"
    y2="12"
  />

      <motion.line
    animate={controls}
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { x1: 7 },
      animate: { x1: 12 }
    }}
    x1="7"
    x2="21"
    y1="18"
    y2="18"
  />
    </motion.g>;
}
