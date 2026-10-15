'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';
import { createDebouncer } from './debounce-model.js';

/**
 * A debounced version of `callback` for search fields, autosave and resize work. The returned
 * function is stable for a given `delay`, always calls the latest callback, and exposes
 * `cancel()`, `flush()` and `isPending()`. Pending work is cancelled on unmount.
 */
export function useDebounceCallback(callback, delay = 300) {
  const callbackRef = useLatestRef(callback);
  const mountedRef = useRef(false);

  const debounced = useMemo(() => {
    const debouncer = createDebouncer((...args) => callbackRef.current(...args), delay);
    const run = (...args) => {
      if (mountedRef.current) debouncer.schedule(...args);
    };
    return Object.assign(run, { cancel: debouncer.cancel, flush: debouncer.flush, isPending: debouncer.isPending });
  }, [ callbackRef, delay ]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      debounced.cancel();
    };
  }, [ debounced ]);

  return debounced;
}
