"use client";
import { useArtworkAnimation } from "./useArtworkAnimation";
import { motion } from "framer-motion";
const shapes = {
  g: motion.g,
  path: motion.path,
  circle: motion.circle,
  ellipse: motion.ellipse,
  line: motion.line,
  polygon: motion.polygon,
  polyline: motion.polyline,
  rect: motion.rect
};
const variants = {
  normal: { pathLength: 1, opacity: 1 },
  animate: { pathLength: [0, 1], opacity: [0.35, 1], transition: { duration: 0.7 } }
};
export function createDrawIcon(nodes) {
  return function DrawIcon({ active }) {
    const controls = useArtworkAnimation(active);
    return <motion.g initial="normal" animate={controls}>
        {nodes.map(([tag, attributes]) => {
      const Shape = shapes[tag];
      const { key, ...props } = attributes;
      return <Shape {...props} key={key} variants={variants} />;
    })}
      </motion.g>;
  };
}
