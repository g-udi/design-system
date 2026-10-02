'use client';

import { useCallback, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../state/use-isomorphic-layout-effect.js';
import { useLatestRef } from '../shared/use-latest-ref.js';

const sameSize = (a, b) => a.width === b.width && a.height === b.height;

/**
 * Measures an element's border box and follows it with a ResizeObserver: container-driven layouts,
 * truncation, canvas and SVG drawing at real pixel sizes. Returns `[ref, { width, height }]`; attach
 * the callback ref to the element. `initialSize` is used on the server and before the first
 * measurement. `onResize` receives each new size without needing state.
 */
export function useElementSize({ initialSize = { width: 0, height: 0 }, onResize, round = true } = {}) {
  const [ node, setNode ] = useState(null);
  const [ size, setSize ] = useState(initialSize);
  const onResizeRef = useLatestRef(onResize);
  const ref = useCallback((element) => setNode(element), []);

  useIsomorphicLayoutEffect(() => {
    if (!node) return undefined;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      const next = round ? { width: Math.round(rect.width), height: Math.round(rect.height) } : { width: rect.width, height: rect.height };
      setSize((current) => (sameSize(current, next) ? current : next));
      onResizeRef.current?.(next);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ node, onResizeRef, round ]);

  return [ ref, size ];
}
