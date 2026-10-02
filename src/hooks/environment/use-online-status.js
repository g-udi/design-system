'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (notify) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('online', notify);
  window.addEventListener('offline', notify);
  return () => {
    window.removeEventListener('online', notify);
    window.removeEventListener('offline', notify);
  };
};
const getSnapshot = () => typeof navigator === 'undefined' || navigator.onLine !== false;
const getServerSnapshot = () => true;

/**
 * False when the browser reports it has lost its network connection. `navigator.onLine` can say
 * online behind a captive portal, so treat `true` as "maybe" and keep request errors as the source
 * of truth; treat `false` as a reliable cue to queue work and say so. True during server rendering.
 */
export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
