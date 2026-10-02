'use client';

import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';

/**
 * A key-value store over Web Storage that notifies subscribers in this tab (other tabs hear the
 * native `storage` event). Reads and writes fall back to memory when storage is blocked (private
 * modes, sandboxed frames, quota errors), so state still works for the session.
 *
 * @param {() => Storage | null | undefined} getStorage
 */
export function createStorageStore(getStorage) {
  const memory = new Map();
  // Keys whose last write storage refused: memory holds their current value.
  const memoryOnly = new Set();
  const listeners = new Map();
  const storage = () => {
    try {
      return getStorage() || null;
    } catch {
      return null;
    }
  };
  const notify = (key) => {
    listeners.get(key)?.forEach((listener) => listener());
    if (key === null) listeners.forEach((set) => set.forEach((listener) => listener()));
  };

  return {
    storage,
    get(key) {
      if (memoryOnly.has(key)) return memory.get(key);
      try {
        const area = storage();
        if (area) return area.getItem(key);
      } catch {
        // Fall through to memory.
      }
      return memory.has(key) ? memory.get(key) : null;
    },
    set(key, raw) {
      memory.set(key, raw);
      try {
        const area = storage();
        if (!area) throw new Error('Storage unavailable');
        area.setItem(key, raw);
        memoryOnly.delete(key);
      } catch {
        // Keep the in-memory value when storage refuses the write.
        memoryOnly.add(key);
      }
      notify(key);
    },
    remove(key) {
      memory.delete(key);
      memoryOnly.delete(key);
      try {
        storage()?.removeItem(key);
      } catch {
        // Nothing stored to remove.
      }
      notify(key);
    },
    subscribe(key, listener) {
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(listener);
      return () => {
        listeners.get(key)?.delete(listener);
        if (!listeners.get(key)?.size) listeners.delete(key);
      };
    },
    notify
  };
}

const parseJSON = (raw) => JSON.parse(raw);

/**
 * useState backed by a storage store. The server render and hydration use `initialValue`; the
 * stored value is read on the client right after. Every caller with the same key stays in sync.
 */
export function useStorageState(store, key, initialValue, { serialize = JSON.stringify, deserialize = parseJSON, syncTabs = true } = {}) {
  const initialRef = useRef(initialValue);
  initialRef.current = initialValue;
  const options = useRef({ serialize, deserialize });
  options.current = { serialize, deserialize };

  const subscribe = useCallback((notify) => {
    const unsubscribe = store.subscribe(key, notify);
    if (!syncTabs || typeof window === 'undefined') return unsubscribe;
    const onStorage = (event) => {
      if (event.storageArea && event.storageArea !== store.storage()) return;
      // A null key means storage.clear() in another tab.
      if (event.key === key || event.key === null) notify();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', onStorage);
    };
  }, [ key, store, syncTabs ]);

  const raw = useSyncExternalStore(subscribe, () => store.get(key), () => null);

  const value = useMemo(() => {
    if (raw === null || raw === undefined) return initialRef.current;
    try {
      return options.current.deserialize(raw);
    } catch {
      return initialRef.current;
    }
  }, [ raw ]);
  const valueRef = useRef(value);
  valueRef.current = value;

  const setValue = useCallback((next) => {
    const resolved = typeof next === 'function' ? next(valueRef.current) : next;
    let serialized;
    try {
      serialized = options.current.serialize(resolved);
    } catch {
      return;
    }
    if (serialized === undefined) return;
    valueRef.current = resolved;
    store.set(key, serialized);
  }, [ key, store ]);

  const removeValue = useCallback(() => {
    valueRef.current = initialRef.current;
    store.remove(key);
  }, [ key, store ]);

  return [ value, setValue, removeValue ];
}
