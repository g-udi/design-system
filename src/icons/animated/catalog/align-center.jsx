// Adapted from lucide-animated/icons/align-center.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    d="M17 12H7"
    variants={{
      normal: { translateX: 0 },
      animate: {
        translateX: [0, 3, -3, 2, -2, 0],
        transition: {
          ease: "linear",
          translateX: {
            duration: 1
          }
        }
      }
    }}
  />
      <path d="M19 18H5" />
      <path d="M21 6H3" />
    </motion.g>;
}
