// Adapted from lucide-animated/icons/panel-right-open.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const DEFAULT_TRANSITION = {
  times: [0, 0.4, 1],
  duration: 0.5
};
const PATH_VARIANTS = {
  normal: { x: 0 },
  animate: { x: [0, -1.5, 0] }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <rect height="18" rx="2" width="18" x="3" y="3" />
      <path d="M15 3v18" />
      <motion.path
    animate={controls}
    d="m10 15-3-3 3-3"
    transition={DEFAULT_TRANSITION}
    variants={PATH_VARIANTS}
  />
    </motion.g>;
}
