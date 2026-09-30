// Adapted from lucide-animated/icons/rotate-ccw.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g
    animate={controls}
    transition={{ type: "spring", stiffness: 250, damping: 25 }}
    variants={{
      normal: { rotate: "0deg" },
      animate: { rotate: "-50deg" }
    }}
    initial="normal"
  >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </motion.g>;
}
