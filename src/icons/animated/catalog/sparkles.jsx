// Adapted from lucide-animated/icons/sparkles.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
const SPARKLE_VARIANTS = {
  initial: {
    y: 0,
    fill: "none"
  },
  hover: {
    y: [0, -1, 0, 0],
    fill: "currentColor",
    transition: {
      duration: 1,
      bounce: 0.3
    }
  }
};
const STAR_VARIANTS = {
  initial: {
    opacity: 1,
    x: 0,
    y: 0
  },
  blink: () => ({
    opacity: [0, 1, 0, 0, 0, 0, 1],
    transition: {
      duration: 2,
      type: "spring",
      stiffness: 70,
      damping: 10,
      mass: 0.4
    }
  })
};
export default function Artwork({ active }) {
  const starControls = useAnimation();
  const sparkleControls = useAnimation();
  useEffect(() => {
    if (active) {
      void sparkleControls.start("hover");
      void starControls.start("blink", { delay: 1 });
    } else {
      starControls.stop();
      starControls.set("initial");
      sparkleControls.stop();
      sparkleControls.set("initial");
    }
    return () => {
      starControls.stop();
      sparkleControls.stop();
    };
  }, [active, starControls, sparkleControls]);
  return <motion.g initial="normal">
      <motion.path
    animate={sparkleControls}
    d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
    variants={SPARKLE_VARIANTS}
  />
      <motion.path animate={starControls} d="M20 3v4" variants={STAR_VARIANTS} />
      <motion.path animate={starControls} d="M22 5h-4" variants={STAR_VARIANTS} />
      <motion.path animate={starControls} d="M4 17v2" variants={STAR_VARIANTS} />
      <motion.path animate={starControls} d="M5 18H3" variants={STAR_VARIANTS} />
    </motion.g>;
}
