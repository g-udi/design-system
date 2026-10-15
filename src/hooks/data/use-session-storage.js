'use client';

import { useStorageState } from './storage-state.js';
import { sessionStorageStore } from './storage-model.js';

/**
 * useState that persists to `sessionStorage` as JSON: a wizard's progress, a half-filled form or a
 * scroll position that should survive a reload but not a new tab. Same API as `useLocalStorage`;
 * session storage is per tab, so there is no cross-tab sync.
 *
 * @param {string} key
 * @param {any} initialValue
 * @param {{ serialize?: (value: any) => string, deserialize?: (raw: string) => any }} [options]
 */
export function useSessionStorage(key, initialValue, options) {
  return useStorageState(sessionStorageStore, key, initialValue, { ...options, syncTabs: false });
}
