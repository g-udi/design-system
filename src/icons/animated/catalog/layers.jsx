// Adapted from lucide-animated/icons/layers.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const DEFAULT_TRANSITION = {
  type: "spring",
  stiffness: 100,
  damping: 14,
  mass: 1
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <motion.path
    animate={controls}
    d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { y: 0 },
      firstState: { y: -9 },
      secondState: { y: 0 }
    }}
  />
      <motion.path
    animate={controls}
    d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { y: 0 },
      firstState: { y: -5 },
      secondState: { y: 0 }
    }}
  />
    </motion.g>;
}
