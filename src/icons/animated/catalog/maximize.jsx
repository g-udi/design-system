// Adapted from lucide-animated/icons/maximize.tsx (MIT). See ../LICENSE.
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
    d="M8 3H5a2 2 0 0 0-2 2v3"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateX: "0%", translateY: "0%" },
      animate: { translateX: "-2px", translateY: "-2px" }
    }}
  />

      <motion.path
    animate={controls}
    d="M21 8V5a2 2 0 0 0-2-2h-3"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateX: "0%", translateY: "0%" },
      animate: { translateX: "2px", translateY: "-2px" }
    }}
  />

      <motion.path
    animate={controls}
    d="M3 16v3a2 2 0 0 0 2 2h3"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateX: "0%", translateY: "0%" },
      animate: { translateX: "-2px", translateY: "2px" }
    }}
  />

      <motion.path
    animate={controls}
    d="M16 21h3a2 2 0 0 0 2-2v-3"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateX: "0%", translateY: "0%" },
      animate: { translateX: "2px", translateY: "2px" }
    }}
  />
    </motion.g>;
}
