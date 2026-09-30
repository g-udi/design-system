// Adapted from lucide-animated/icons/arrow-right.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const PATH_VARIANTS = {
  normal: { d: "M5 12h14" },
  animate: {
    d: ["M5 12h14", "M5 12h9", "M5 12h14"],
    transition: {
      duration: 0.4
    }
  }
};
const SECONDARY_PATH_VARIANTS = {
  normal: { d: "m12 5 7 7-7 7", translateX: 0 },
  animate: {
    d: "m12 5 7 7-7 7",
    translateX: [0, -3, 0],
    transition: {
      duration: 0.4
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path animate={controls} d="M5 12h14" variants={PATH_VARIANTS} />
      <motion.path animate={controls} d="m12 5 7 7-7 7" variants={SECONDARY_PATH_VARIANTS} />
    </motion.g>;
}
