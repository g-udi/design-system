// Adapted from lucide-animated/icons/chevron-right.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const DEFAULT_TRANSITION = {
  times: [0, 0.4, 1],
  duration: 0.5
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    d="m9 18 6-6-6-6"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { x: 0 },
      animate: { x: [0, 2, 0] }
    }}
  />
    </motion.g>;
}
