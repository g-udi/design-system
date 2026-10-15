'use client';

import { useMediaQuery } from './use-media-query.js';
import { MOBILE_BREAKPOINT } from './mobile-model.js';

/**
 * True below the 768px phone breakpoint. False during server rendering and hydration, then the
 * measured value; built on `useMediaQuery`.
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`, false);
}
