'use client';

import { useCallback, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../state/use-isomorphic-layout-effect.js';
import { useLatestRef } from '../shared/use-latest-ref.js';
import { observeResize } from '../../utilities/observeResize.js';

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
    let previous;
    const measure = ([entry] = []) => {
      const style = getComputedStyle(node);
      const box = entry?.borderBoxSize?.[0];
      const vertical = style.writingMode.startsWith('vertical') || style.writingMode.startsWith('sideways');
      // Layout dimensions stay stable while a dialog or card is transformed.
      const borderSize = (axis, sides) => {
        const value = parseFloat(style[axis]);
        if (!Number.isFinite(value)) return (axis === 'width' ? node.offsetWidth : node.offsetHeight) ?? node.getBoundingClientRect()[axis];
        return value + (style.boxSizing === 'border-box' ? 0 : sides.reduce((sum, side) => sum + parseFloat(style['padding' + side]) + parseFloat(style['border' + side + 'Width']), 0));
      };
      const width = box ? (vertical ? box.blockSize : box.inlineSize) : borderSize('width', ['Left', 'Right']);
      const height = box ? (vertical ? box.inlineSize : box.blockSize) : borderSize('height', ['Top', 'Bottom']);
      const next = round ? { width: Math.round(width), height: Math.round(height) } : { width, height };
      if (previous && sameSize(previous, next)) return;
      previous = next;
      setSize((current) => (sameSize(current, next) ? current : next));
      onResizeRef.current?.(next);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = observeResize(measure);
    observer.observe(node, { box: 'border-box' });
    return () => observer.disconnect();
  }, [ node, onResizeRef, round ]);

  return [ ref, size ];
}
