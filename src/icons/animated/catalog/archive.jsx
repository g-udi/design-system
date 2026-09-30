// Adapted from lucide-animated/icons/archive.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const RECT_VARIANTS = {
  normal: {
    translateY: 0,
    transition: {
      duration: 0.2,
      type: "spring",
      stiffness: 200,
      damping: 25
    }
  },
  animate: {
    translateY: -1.5,
    transition: {
      duration: 0.2,
      type: "spring",
      stiffness: 200,
      damping: 25
    }
  }
};
const PATH_VARIANTS = {
  normal: { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" },
  animate: { d: "M4 11v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11" }
};
const SECONDARY_PATH_VARIANTS = {
  normal: { d: "M10 12h4" },
  animate: { d: "M10 15h4" }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.rect
    animate={controls}
    height="5"
    initial="normal"
    rx="1"
    variants={RECT_VARIANTS}
    width="20"
    x="2"
    y="3"
  />
      <motion.path
    animate={controls}
    d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"
    variants={PATH_VARIANTS}
  />
      <motion.path animate={controls} d="M10 12h4" variants={SECONDARY_PATH_VARIANTS} />
    </motion.g>;
}
