// Adapted from lucide-animated/icons/message-square-more.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const DOT_VARIANTS = {
  normal: {
    opacity: 1
  },
  animate: (custom) => ({
    opacity: [1, 0, 0, 1, 1, 0, 0, 1],
    transition: {
      opacity: {
        times: [
          0,
          0.1,
          0.1 + custom * 0.1,
          0.1 + custom * 0.1 + 0.1,
          0.5,
          0.6,
          0.6 + custom * 0.1,
          0.6 + custom * 0.1 + 0.1
        ],
        duration: 1.5
      }
    }
  })
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <motion.path animate={controls} custom={0} d="M8 10h.01" variants={DOT_VARIANTS} />
      <motion.path animate={controls} custom={1} d="M12 10h.01" variants={DOT_VARIANTS} />
      <motion.path animate={controls} custom={2} d="M16 10h.01" variants={DOT_VARIANTS} />
    </motion.g>;
}
