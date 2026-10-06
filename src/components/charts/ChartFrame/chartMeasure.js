'use client';

import { useElementSize } from '../../../hooks/layout/use-element-size.js';

/** Width-only adapter for chart plots; observation and SSR behavior belong to the shared hook. */
export function useMeasuredWidth(fallback = 0) {
  const [ref, { width }] = useElementSize({ initialSize: { width: fallback, height: 0 } });
  return [ref, width];
}
