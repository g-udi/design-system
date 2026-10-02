'use client';

import { useMediaQuery } from './use-media-query.js';

/** The phone breakpoint in pixels: widths below it count as mobile. Matches Tailwind's `md`. */
export const MOBILE_BREAKPOINT = 768;

/**
 * True below the 768px phone breakpoint. False during server rendering and hydration, then the
 * measured value; built on `useMediaQuery`.
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`, false);
}
