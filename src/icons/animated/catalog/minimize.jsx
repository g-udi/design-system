// Adapted from lucide-animated/icons/minimize.tsx (MIT). See ../LICENSE.
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
    d="M8 3v3a2 2 0 0 1-2 2H3"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateX: "0%", translateY: "0%" },
      animate: { translateX: "2px", translateY: "2px" }
    }}
  />
      <motion.path
    animate={controls}
    d="M21 8h-3a2 2 0 0 1-2-2V3"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateX: "0%", translateY: "0%" },
      animate: { translateX: "-2px", translateY: "2px" }
    }}
  />
      <motion.path
    animate={controls}
    d="M3 16h3a2 2 0 0 1 2 2v3"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateX: "0%", translateY: "0%" },
      animate: { translateX: "2px", translateY: "-2px" }
    }}
  />
      <motion.path
    animate={controls}
    d="M16 21v-3a2 2 0 0 1 2-2h3"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateX: "0%", translateY: "0%" },
      animate: { translateX: "-2px", translateY: "-2px" }
    }}
  />
    </motion.g>;
}
