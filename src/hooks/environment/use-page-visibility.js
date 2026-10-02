'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (notify) => {
  if (typeof document === 'undefined') return () => {};
  document.addEventListener('visibilitychange', notify);
  return () => document.removeEventListener('visibilitychange', notify);
};
const getSnapshot = () => typeof document === 'undefined' || document.visibilityState !== 'hidden';
const getServerSnapshot = () => true;

/**
 * True while the tab is visible. Pause polling, carousels, video and animation loops when the
 * reader switches away, and resume when they return. True during server rendering.
 */
export function usePageVisibility() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
