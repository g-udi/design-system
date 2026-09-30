// Adapted from lucide-animated/icons/id-card.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const VARIANTS = {
  normal: {
    pathLength: 1,
    opacity: 1
  },
  animate: (custom) => ({
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 0.3,
      delay: custom * 0.1
    }
  })
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path animate={controls} custom={2} d="M16 10h2" variants={VARIANTS} />
      <motion.path animate={controls} custom={2} d="M16 14h2" variants={VARIANTS} />
      <motion.path
    animate={controls}
    custom={0}
    d="M6.17 15a3 3 0 0 1 5.66 0"
    variants={VARIANTS}
  />
      <motion.circle animate={controls} custom={1} cx="9" cy="11" r="2" variants={VARIANTS} />
      <rect height="14" rx="2" width="20" x="2" y="5" />
    </motion.g>;
}
