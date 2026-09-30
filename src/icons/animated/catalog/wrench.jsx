// Adapted from lucide-animated/icons/wrench.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const ICON_VARIANTS = {
  normal: {
    rotate: 0,
    transition: { duration: 0.25, ease: "easeOut" }
  },
  animate: {
    rotate: [0, 12, -14, 4, 0],
    transition: {
      duration: 1.05,
      times: [0, 0.42, 0.68, 0.88, 1],
      ease: ["easeInOut", "easeInOut", "easeOut", "easeOut"]
    }
  }
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g
    animate={controls}
    initial="normal"
    style={{ transformOrigin: "90% 10%", transformBox: "fill-box" }}
    variants={ICON_VARIANTS}
  >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" />
    </motion.g>;
}
