// Adapted from lucide-animated/icons/bot.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <path d="M12 8V4H8" />
      <rect height="12" rx="2" width="16" x="4" y="8" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />

      <motion.line
    animate={controls}
    initial="normal"
    variants={{
      normal: { y1: 13, y2: 15 },
      animate: {
        y1: [13, 14, 13],
        y2: [15, 14, 15],
        transition: {
          duration: 0.5,
          ease: "easeInOut",
          delay: 0.2
        }
      }
    }}
    x1={15}
    x2={15}
  />

      <motion.line
    animate={controls}
    initial="normal"
    variants={{
      normal: { y1: 13, y2: 15 },
      animate: {
        y1: [13, 14, 13],
        y2: [15, 14, 15],
        transition: {
          duration: 0.5,
          ease: "easeInOut",
          delay: 0.2
        }
      }
    }}
    x1={9}
    x2={9}
  />
    </motion.g>;
}
