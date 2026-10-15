'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { subscribeMediaQuery } from './media-query-model.js';

/**
 * Tracks a CSS media query, for layouts that render a different tree at a breakpoint (for example
 * one pane at a time on phones instead of two resizable panes) and for user preferences. Returns
 * `fallback` during server rendering and hydration, so markup stays stable until the query is
 * measured; client-only renders read the real value immediately.
 */
export function useMediaQuery(query, fallback = false) {
  const subscribe = useCallback((notify) => subscribeMediaQuery(query, notify), [ query ]);
  const getSnapshot = useCallback(
    () => (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : fallback),
    [ fallback, query ]
  );
  return useSyncExternalStore(subscribe, getSnapshot, () => fallback);
}
