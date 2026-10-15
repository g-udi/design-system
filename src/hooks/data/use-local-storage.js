'use client';

import { useStorageState } from './storage-state.js';
import { localStorageStore } from './storage-model.js';

/**
 * useState that persists to `localStorage` as JSON: reading preferences, dismissed notices, draft
 * text, table layouts. Returns `[value, setValue, removeValue]`. `initialValue` is used on the
 * server, during hydration and when nothing is stored. Callers with the same key stay in sync in
 * this tab and across tabs. Never store secrets or personal data here.
 *
 * @param {string} key
 * @param {any} initialValue
 * @param {{ serialize?: (value: any) => string, deserialize?: (raw: string) => any, syncTabs?: boolean }} [options]
 */
export function useLocalStorage(key, initialValue, options) {
  return useStorageState(localStorageStore, key, initialValue, options);
}
