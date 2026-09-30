// Adapted from lucide-animated/icons/eye.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
    style={{ originY: "50%" }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    variants={{
      normal: { scaleY: 1, opacity: 1 },
      animate: { scaleY: [1, 0.1, 1], opacity: [1, 0.3, 1] }
    }}
  />
      <motion.circle
    animate={controls}
    cx="12"
    cy="12"
    r="3"
    transition={{ duration: 0.4, ease: "easeInOut" }}
    variants={{
      normal: { scale: 1, opacity: 1 },
      animate: { scale: [1, 0.3, 1], opacity: [1, 0.3, 1] }
    }}
  />
    </motion.g>;
}
