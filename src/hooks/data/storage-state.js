'use client';

import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';

const parseJSON = (raw) => JSON.parse(raw);

/**
 * useState backed by a storage store. The server render and hydration use `initialValue`; the
 * stored value is read on the client right after. Every caller with the same key stays in sync.
 */
export function useStorageValue(store, key, initialValue, { deserialize = parseJSON, syncTabs = true } = {}) {
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

  const stored = useMemo(() => {
    if (raw === null || raw === undefined) return null;
    try {
      return { value: deserialize(raw) };
    } catch {
      return null;
    }
  }, [ raw, deserialize ]);
  return stored ? stored.value : initialValue;
}

export function useStorageState(store, key, initialValue, { serialize = JSON.stringify, ...readOptions } = {}) {
  const value = useStorageValue(store, key, initialValue, readOptions);
  const initialRef = useRef(initialValue);
  initialRef.current = initialValue;
  const options = useRef({ serialize });
  options.current = { serialize };
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
