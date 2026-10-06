'use client';

import { useEffect, useState } from 'react';
import { useEventListener } from '../interaction/use-event-listener.js';

/** Layout viewport dimensions in CSS pixels; deterministic zeros until the first client effect. */
export function useWindowSize({ initialWidth = 0, initialHeight = 0 } = {}) {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const measure = () => setSize((previous) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return previous.width === width && previous.height === height ? previous : { width, height };
  });
  useEventListener('resize', measure);
  useEffect(measure, []);
  return size;
}
