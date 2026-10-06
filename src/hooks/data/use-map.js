'use client';

import { useCallback, useMemo, useState } from 'react';

/** Map state. Treat the returned Map as read-only; actions always create a fresh Map. */
export function useMap(initialEntries = []) {
  // Snapshot a seed once so single-use iterators remain reusable by reset.
  const [initial] = useState(() => new Map(initialEntries));
  const [map, setMap] = useState(() => new Map(initial));
  const set = useCallback((key, value) => setMap((current) => new Map(current).set(key, value)), []);
  const remove = useCallback((key) => setMap((current) => {
    if (!current.has(key)) return current;
    const next = new Map(current);
    next.delete(key);
    return next;
  }), []);
  const setAll = useCallback((entries) => setMap(new Map(entries)), []);
  const clear = useCallback(() => setMap(new Map()), []);
  const reset = useCallback(() => setMap(new Map(initial)), [initial]);
  const actions = useMemo(() => ({ set, remove, setAll, clear, reset }), [set, remove, setAll, clear, reset]);
  return [map, actions];
}
