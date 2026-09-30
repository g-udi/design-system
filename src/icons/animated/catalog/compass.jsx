// Adapted from lucide-animated/icons/compass.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <circle cx="12" cy="12" r="10" />
      <motion.polygon
    animate={controls}
    points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
    transition={{
      type: "spring",
      stiffness: 120,
      damping: 15
    }}
    variants={{
      normal: {
        rotate: 0
      },
      animate: {
        rotate: 360
      }
    }}
  />
    </motion.g>;
}
