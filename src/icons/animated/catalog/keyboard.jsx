// Adapted from lucide-animated/icons/keyboard.tsx (MIT). See ../LICENSE.
// Source: 072c38b1b04ea738d90a084485ccaad4b890ddca
"use client";
import { useEffect } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
const KEYBOARD_PATHS = [
  { id: "key1", d: "M10 8h.01" },
  { id: "key2", d: "M12 12h.01" },
  { id: "key3", d: "M14 8h.01" },
  { id: "key4", d: "M16 12h.01" },
  { id: "key5", d: "M18 8h.01" },
  { id: "key6", d: "M6 8h.01" },
  { id: "key7", d: "M7 16h10" },
  { id: "key8", d: "M8 12h.01" }
];
export default function Artwork({ active }) {
  const controls = useAnimation();
  useEffect(() => {
    if (active) {
      void controls.start((i) => ({
        opacity: [1, 0.2, 1],
        transition: {
          duration: 1.5,
          times: [0, 0.5, 1],
          delay: i * 0.06,
          repeat: 1,
          repeatType: "reverse"
        }
      }));
    } else {
      controls.stop();
      controls.set({ opacity: 1 });
    }
    return () => {
      controls.stop();
    };
  }, [active, controls]);
  return <motion.g initial="normal">
      <rect height="16" rx="2" width="20" x="2" y="4" />
      <AnimatePresence>
        {KEYBOARD_PATHS.map((path, index) => <motion.path
    animate={controls}
    custom={index}
    d={path.d}
    initial={{ opacity: 1 }}
    key={path.id}
  />)}
      </AnimatePresence>
    </motion.g>;
}
