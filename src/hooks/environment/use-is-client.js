'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * False during server rendering and hydration, true once rendering on the client. Use it to defer
 * browser-only content (theme toggles, locale-formatted times, storage-backed values) without a
 * hydration mismatch, and without the extra render of a mounted flag set in an effect.
 */
export function useIsClient() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
