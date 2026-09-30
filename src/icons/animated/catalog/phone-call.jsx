// Adapted from lucide-animated/icons/phone-call.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
const PHONE_CALL_VARIANTS = {
  normal: {
    rotate: 0,
    scale: 1
  },
  animate: {
    rotate: [10, 20, -10, 10, 0],
    scale: [1, 1.1, 1.2, 1.1, 1],
    transition: {
      duration: 0.9,
      ease: "easeInOut"
    }
  }
};
const PATH_VARIANTS = {
  normal: {
    opacity: 1,
    transition: {
      duration: 0.4
    }
  },
  fadeOut: {
    opacity: 0,
    transition: { duration: 0.3 }
  },
  fadeIn: (i) => ({
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: i * 0.1
    }
  })
};
export default function Artwork({ active }) {
  const svgControls = useAnimation();
  const pathControls = useAnimation();
  useEffect(() => {
    let cancelled = false;
    if (active) {
      void svgControls.start("animate");
      void (async () => {
        await pathControls.start("fadeOut");
        if (!cancelled) await pathControls.start("fadeIn");
      })();
    } else {
      svgControls.stop();
      svgControls.set("normal");
      pathControls.stop();
      pathControls.set("normal");
    }
    return () => {
      cancelled = true;
      svgControls.stop();
      pathControls.stop();
    };
  }, [active, svgControls, pathControls]);
  return <motion.g
    animate={svgControls}
    initial="normal"
    style={{ overflow: "visible" }}
    variants={PHONE_CALL_VARIANTS}
  >
      <motion.path
    animate={pathControls}
    custom={2}
    d="M13 2a9 9 0 0 1 9 9"
    initial={{ opacity: 1 }}
    variants={PATH_VARIANTS}
  />
      <motion.path
    animate={pathControls}
    custom={1}
    d="M13 6a5 5 0 0 1 5 5"
    initial={{ opacity: 1 }}
    variants={PATH_VARIANTS}
  />
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </motion.g>;
}
