// Adapted from lucide-animated/icons/plus.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g
    animate={controls}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
    variants={{
      normal: {
        rotate: 0
      },
      animate: {
        rotate: 180
      }
    }}
    initial="normal"
  >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </motion.g>;
}
