// Adapted from lucide-animated/icons/copy.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const DEFAULT_TRANSITION = {
  type: "spring",
  stiffness: 160,
  damping: 17,
  mass: 1
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.rect
    animate={controls}
    height="14"
    rx="2"
    ry="2"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { translateY: 0, translateX: 0 },
      animate: { translateY: -3, translateX: -3 }
    }}
    width="14"
    x="8"
    y="8"
  />
      <motion.path
    animate={controls}
    d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
    transition={DEFAULT_TRANSITION}
    variants={{
      normal: { x: 0, y: 0 },
      animate: { x: 3, y: 3 }
    }}
  />
    </motion.g>;
}
