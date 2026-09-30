// Adapted from lucide-animated/icons/heart-pulse.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
const HEART_DRAW_VARIANTS = {
  normal: { pathLength: 1, opacity: 1 },
  hidden: { pathLength: 0, opacity: 0 },
  draw: { pathLength: [0, 1], opacity: [0, 1] }
};
const HEART_PULSE_VARIANTS = {
  normal: { scale: 1 },
  pulse: { scale: [1, 1.08, 1] }
};
const LINE_VARIANTS = {
  normal: { pathLength: 1, pathOffset: 0, opacity: 1 },
  animate: { pathLength: [0, 1], pathOffset: [1, 0], opacity: [0, 1] }
};
export default function Artwork({ active }) {
  const heartDrawControls = useAnimation();
  const heartPulseControls = useAnimation();
  const lineControls = useAnimation();
  useEffect(() => {
    let cancelled = false;
    if (active) {
      heartDrawControls.set("hidden");
      void (async () => {
        await lineControls.start("animate", {
          duration: 0.6,
          ease: "linear",
          opacity: { duration: 0.1 }
        });
        if (cancelled) return;
        await heartDrawControls.start("draw", {
          duration: 0.5,
          ease: "easeOut",
          opacity: { duration: 0.1 }
        });
        if (cancelled) return;
        void heartPulseControls.start("pulse", { duration: 0.9, repeat: 1, ease: "easeInOut" });
      })();
    } else {
      heartDrawControls.stop();
      heartDrawControls.set("normal");
      heartPulseControls.stop();
      heartPulseControls.set("normal");
      lineControls.stop();
      lineControls.set("normal");
    }
    return () => {
      cancelled = true;
      heartDrawControls.stop();
      heartPulseControls.stop();
      lineControls.stop();
    };
  }, [active, heartDrawControls, heartPulseControls, lineControls]);
  return <motion.g initial="normal">
      <motion.g
    animate={heartPulseControls}
    style={{ originX: "12px", originY: "12px" }}
    variants={HEART_PULSE_VARIANTS}
  >
        <motion.path
    animate={heartDrawControls}
    d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
    variants={HEART_DRAW_VARIANTS}
  />
      </motion.g>
      <motion.path
    animate={lineControls}
    d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"
    variants={LINE_VARIANTS}
  />
    </motion.g>;
}
