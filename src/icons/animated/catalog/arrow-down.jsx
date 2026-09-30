// Adapted from lucide-animated/icons/arrow-down.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const PATH_VARIANTS = {
  normal: { d: "m19 12-7 7-7-7", translateY: 0 },
  animate: {
    d: "m19 12-7 7-7-7",
    translateY: [0, -3, 0],
    transition: {
      duration: 0.4
    }
  }
};
const SECOND_PATH_VARIANTS = {
  normal: { d: "M12 5v14" },
  animate: {
    d: ["M12 5v14", "M12 5v9", "M12 5v14"],
    transition: {
      duration: 0.4
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.path animate={controls} d="m19 12-7 7-7-7" variants={PATH_VARIANTS} />
      <motion.path animate={controls} d="M12 5v14" variants={SECOND_PATH_VARIANTS} />
    </motion.g>;
}
