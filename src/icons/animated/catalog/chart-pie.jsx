// Adapted from lucide-animated/icons/chart-pie.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const PATH_VARIANTS = {
  normal: { translateX: 0, translateY: 0 },
  animate: { translateX: 1.1, translateY: -1.1 }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"
    transition={{
      type: "spring",
      stiffness: 250,
      damping: 15,
      bounce: 0.6
    }}
    variants={PATH_VARIANTS}
  />
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    </motion.g>;
}
