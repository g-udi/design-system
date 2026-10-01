'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Track an element's content width, for charts drawn as SVG at real pixel sizes.
 *
 * @param {number} [fallback=0] - Width before the first measurement (and during SSR).
 * @returns {[React.RefObject<HTMLElement>, number]} The ref to attach and the current width.
 */
export function useMeasuredWidth(fallback = 0) {
  const ref = useRef(null);
  const [ width, setWidth ] = useState(fallback);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const update = () => setWidth(Math.round(node.getBoundingClientRect().width));
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return [ ref, width ];
}
