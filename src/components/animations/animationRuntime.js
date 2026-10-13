'use client';
import { useRef } from 'react';
import { clamp } from '../../utilities/clamp.js';
import { useInView } from '../../hooks/layout/use-in-view.js';
import { useMergedRefs } from '../../hooks/state/use-merged-refs.js';
import { usePrefersReducedMotion } from '../../hooks/a11y/use-prefers-reduced-motion.js';
import { usePageVisibility } from '../../hooks/environment/use-page-visibility.js';

export const bounded = (value, fallback, min, max) => Number.isFinite(value) ? clamp(value, min, max) : fallback;
export const characters = text => Array.from(String(text ?? ''));

// Shared lifecycle for the animation family. Visibility never hides meaningful content.
export function useAnimation(paused, forwardedRef) {
  const root = useRef(null);
  const [viewRef, inView] = useInView({ initialInView: true });
  const reduced = usePrefersReducedMotion();
  const visible = usePageVisibility();
  const ref = useMergedRefs(root, viewRef, forwardedRef);
  return { ref, root, reduced, active: !paused && !reduced && visible && inView };
}
