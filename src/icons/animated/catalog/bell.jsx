// Adapted from lucide-animated/icons/bell.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const SVG_VARIANTS = {
  normal: { rotate: 0 },
  animate: { rotate: [0, -10, 10, -10, 0] }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g
    animate={controls}
    transition={{
      duration: 0.5,
      ease: "easeInOut"
    }}
    variants={SVG_VARIANTS}
    initial="normal"
  >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </motion.g>;
}
