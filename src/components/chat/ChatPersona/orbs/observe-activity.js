'use client';

import { matchesMediaQuery, subscribeMediaQuery } from '../../../../hooks/environment/use-media-query.js';
import { REDUCED_MOTION_QUERY } from '../../../../hooks/a11y/use-prefers-reduced-motion.js';

export const prefersReducedMotion = () => matchesMediaQuery(REDUCED_MOTION_QUERY);
export const subscribeReducedMotion = (notify) => subscribeMediaQuery(REDUCED_MOTION_QUERY, notify);

/**
 * Calls `notify(active)` when the element enters or leaves the viewport or the tab is hidden, so
 * animation loops stop when nobody can see them. Safe without IntersectionObserver or a document.
 */
export function observeActivity(element, notify) {
  if (!element || typeof document === 'undefined') return () => {};
  let inView = true;
  let last = null;
  const emit = () => {
    const next = inView && document.visibilityState !== 'hidden';
    if (next !== last) {
      last = next;
      notify(next);
    }
  };
  let observer = null;
  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(([ entry ]) => {
      if (!entry) return;
      inView = entry.isIntersecting;
      emit();
    });
    observer.observe(element);
  }
  document.addEventListener('visibilitychange', emit);
  emit();
  return () => {
    observer?.disconnect();
    document.removeEventListener('visibilitychange', emit);
  };
}

/**
 * Runs `frame(dt)` on animation frames while `shouldRun()` holds, and `still()` otherwise. Returns
 * `{ sync, stop }`: call `sync` whenever motion preference, visibility or activity changes.
 */
export function createLoop(frame, still) {
  let raf = 0;
  let last = null;
  let running = false;
  const tick = (now) => {
    if (!running) return;
    if (last === null) last = now;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    frame(dt);
    raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (running || typeof requestAnimationFrame === 'undefined') return;
    running = true;
    last = null;
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf);
  };
  const sync = (shouldRun) => {
    if (shouldRun) start();
    else {
      stop();
      still();
    }
  };
  return { sync, stop, isRunning: () => running };
}
