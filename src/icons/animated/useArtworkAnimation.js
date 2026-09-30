"use client";
import { useEffect } from "react";
import { useAnimation } from "framer-motion";
export function useArtworkAnimation(active, restingVariant = "normal") {
  const controls = useAnimation();
  useEffect(() => {
    if (active) void controls.start("animate");
    else {
      controls.stop();
      controls.set(restingVariant);
    }
    return () => controls.stop();
  }, [active, controls, restingVariant]);
  return controls;
}
