// Adapted from lucide-animated/icons/arrow-left.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const PATH_VARIANTS = {
  normal: { d: "m12 19-7-7 7-7", translateX: 0 },
  animate: {
    d: "m12 19-7-7 7-7",
    translateX: [0, 3, 0],
    transition: {
      duration: 0.4
    }
  }
};
const SECOND_PATH_VARIANTS = {
  normal: { d: "M19 12H5" },
  animate: {
    d: ["M19 12H5", "M19 12H10", "M19 12H5"],
    transition: {
      duration: 0.4
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path animate={controls} d="m12 19-7-7 7-7" variants={PATH_VARIANTS} />
      <motion.path animate={controls} d="M19 12H5" variants={SECOND_PATH_VARIANTS} />
    </motion.g>;
}
