'use client';

import { localStorageStore } from './storage-model.js';
import { useStorageValue } from './storage-state.js';

/** Read and subscribe without write actions. Uses the same store as useLocalStorage. */
export function useReadLocalStorage(key, initialValue = null, options) {
  return useStorageValue(localStorageStore, key, initialValue, options);
}
