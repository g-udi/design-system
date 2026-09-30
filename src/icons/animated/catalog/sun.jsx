// Adapted from lucide-animated/icons/sun.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useArtworkAnimation } from "../useArtworkAnimation";
import { motion } from "framer-motion";
const PATH_VARIANTS = {
  normal: { opacity: 1 },
  animate: (i) => ({
    opacity: [0, 1],
    transition: { delay: i * 0.1, duration: 0.3 }
  })
};
export default function Artwork({ active }) {
  const controls = useArtworkAnimation(active);
  return <motion.g initial="normal">
      <circle cx="12" cy="12" r="4" />
      {[
    "M12 2v2",
    "m19.07 4.93-1.41 1.41",
    "M20 12h2",
    "m17.66 17.66 1.41 1.41",
    "M12 20v2",
    "m6.34 17.66-1.41 1.41",
    "M2 12h2",
    "m4.93 4.93 1.41 1.41"
  ].map((d, index) => <motion.path animate={controls} custom={index + 1} d={d} key={d} variants={PATH_VARIANTS} />)}
    </motion.g>;
}
