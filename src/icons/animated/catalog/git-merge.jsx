// Adapted from lucide-animated/icons/git-merge.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const DURATION = 0.3;
const CALCULATE_DELAY = (i) => {
  if (i === 0) return 0.1;
  return i * DURATION + 0.1;
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <motion.circle
    animate={controls}
    cx="18"
    cy="18"
    r="3"
    transition={{
      duration: DURATION,
      delay: CALCULATE_DELAY(0),
      opacity: { delay: CALCULATE_DELAY(0) }
    }}
    variants={{
      normal: { pathLength: 1, opacity: 1, transition: { delay: 0 } },
      animate: {
        pathLength: [0, 1],
        opacity: [0, 1]
      }
    }}
  />

      <motion.circle
    animate={controls}
    cx="6"
    cy="6"
    r="3"
    transition={{
      duration: DURATION,
      delay: CALCULATE_DELAY(2),
      opacity: { delay: CALCULATE_DELAY(2) }
    }}
    variants={{
      normal: { pathLength: 1, opacity: 1, transition: { delay: 0 } },
      animate: {
        pathLength: [0, 1],
        opacity: [0, 1]
      }
    }}
  />

      <motion.path
    animate={controls}
    d="M6 21V9a9 9 0 0 0 9 9"
    transition={{
      duration: DURATION,
      delay: CALCULATE_DELAY(1),
      opacity: { delay: CALCULATE_DELAY(1) }
    }}
    variants={{
      normal: {
        pathLength: 1,
        pathOffset: 0,
        opacity: 1,
        transition: { delay: 0 }
      },
      animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        pathOffset: [1, 0]
      }
    }}
  />
    </motion.g>;
}
