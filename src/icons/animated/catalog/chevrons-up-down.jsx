// Adapted from lucide-animated/icons/chevrons-up-down.tsx (MIT). See ../LICENSE.
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
    d="m7 15 5 5 5-5"
    initial="normal"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateY: "0%" },
      animate: { translateY: "2px" }
    }}
  />
      <motion.path
    animate={controls}
    d="m7 9 5-5 5 5"
    initial="normal"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateY: "0%" },
      animate: { translateY: "-2px" }
    }}
  />
    </motion.g>;
}
