'use client';

import { useEffect, useState } from 'react';
import { useEventListener } from '../interaction/use-event-listener.js';

/** A plain snapshot, rather than the mutable Screen object. Undefined on the server. */
export function useScreen() {
  const [screen, setScreen] = useState(undefined);
  const measure = () => {
    const source = window.screen;
    const next = { width: source.width, height: source.height, availWidth: source.availWidth, availHeight: source.availHeight, colorDepth: source.colorDepth, pixelDepth: source.pixelDepth, orientation: source.orientation?.type ?? null, angle: source.orientation?.angle ?? null };
    setScreen((previous) => previous && Object.keys(next).every((key) => previous[key] === next[key]) ? previous : next);
  };
  useEventListener('resize', measure);
  useEventListener('orientationchange', measure);
  useEffect(() => {
    measure();
    const orientation = window.screen.orientation;
    orientation?.addEventListener('change', measure);
    return () => orientation?.removeEventListener('change', measure);
  }, []);
  return screen;
}
