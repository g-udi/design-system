// Adapted from lucide-animated/icons/chart-no-axes-column-increasing.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const LINE_VARIANTS = {
  visible: { pathLength: 1, opacity: 1 },
  hidden: { pathLength: 0, opacity: 0 }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path
    animate={controls}
    custom={0}
    d="M6 20v-4"
    initial="visible"
    variants={LINE_VARIANTS}
  />
      <motion.path
    animate={controls}
    custom={1}
    d="M12 20v-10"
    initial="visible"
    variants={LINE_VARIANTS}
  />
      <motion.path
    animate={controls}
    custom={2}
    d="M18 20v-16"
    initial="visible"
    variants={LINE_VARIANTS}
  />
    </motion.g>;
}
