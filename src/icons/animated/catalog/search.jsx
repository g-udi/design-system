// Adapted from lucide-animated/icons/search.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g
    animate={controls}
    transition={{
      duration: 1,
      bounce: 0.3
    }}
    variants={{
      normal: { x: 0, y: 0 },
      animate: {
        x: [0, 0, -3, 0],
        y: [0, -4, 0, 0]
      }
    }}
    initial="normal"
  >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </motion.g>;
}
