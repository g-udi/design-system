'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';

/**
 * A plain debouncer: `schedule(...args)` restarts the timer and the callback runs once, `delay` ms
 * after the last call, with the latest arguments. `flush()` runs pending work now; `cancel()` drops it.
 */
export function createDebouncer(callback, delay = 300, { setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  let timer = null;
  let pending = null;
  const cancel = () => {
    if (timer !== null) clearTimer(timer);
    timer = null;
    pending = null;
  };
  const flush = () => {
    const args = pending;
    // Release the completed work before calling the host, which may schedule more.
    cancel();
    if (args) callback(...args);
  };
  const schedule = (...args) => {
    if (timer !== null) clearTimer(timer);
    pending = args;
    timer = setTimer(flush, delay);
  };
  return { schedule, flush, cancel, isPending: () => pending !== null };
}

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
