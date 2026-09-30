// Adapted from lucide-animated/icons/grip-vertical.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const CIRCLES = [
  { cx: 9, cy: 5 },
  { cx: 9, cy: 12 },
  { cx: 9, cy: 19 },
  { cx: 15, cy: 5 },
  { cx: 15, cy: 12 },
  { cx: 15, cy: 19 }
];
const ROWS = 3;
const VARIANTS = {
  normal: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" }
  },
  animate: (data) => {
    const row = data.index % ROWS;
    const col = Math.floor(data.index / ROWS);
    const delay = row * 0.15 + col * (ROWS * 0.15 - 0.2);
    return {
      opacity: [1, 0.4, 1],
      scale: [1, 0.85, 1],
      transition: { delay, duration: 1, ease: "easeInOut" }
    };
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      {CIRCLES.map((circle, index) => <motion.circle
    animate={controls}
    custom={{ index }}
    cx={circle.cx}
    cy={circle.cy}
    initial="normal"
    key={`${circle.cx}-${circle.cy}`}
    r="1"
    variants={VARIANTS}
  />)}
    </motion.g>;
}
