'use client';

import { useMediaQuery } from '../environment/use-media-query.js';
import { REDUCED_MOTION_QUERY } from './reduced-motion-model.js';

/**
 * True when the reader asked the operating system to reduce motion. Skip autoplay, parallax,
 * typing effects and smooth scrolling when it is set. `fallback` (default false) applies during
 * server rendering and hydration.
 */
export function usePrefersReducedMotion(fallback = false) {
  return useMediaQuery(REDUCED_MOTION_QUERY, fallback);
}
