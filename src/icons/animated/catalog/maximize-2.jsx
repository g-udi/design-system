// Adapted from lucide-animated/icons/maximize-2.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const DEFAULT_TRANSITION = {
  type: "spring",
  stiffness: 250,
  damping: 25
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    d="M3 16.2V21m0 0h4.8M3 21l6-6"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateX: "0%", translateY: "0%" },
      animate: { translateX: "-2px", translateY: "2px" }
    }}
  />
      <motion.path
    animate={controls}
    d="M21 7.8V3m0 0h-4.8M21 3l-6 6"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateX: "0%", translateY: "0%" },
      animate: { translateX: "2px", translateY: "-2px" }
    }}
  />
    </motion.g>;
}
