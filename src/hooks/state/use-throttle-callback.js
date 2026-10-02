'use client';

import { useEffect, useMemo } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';

/**
 * A plain throttler: the first call runs at once (`leading`); later calls inside the window fold
 * into one trailing call with the latest arguments (`trailing`).
 */
export function createThrottler(callback, wait = 200, {
  leading = true,
  trailing = true,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = clearTimeout
} = {}) {
  let last = -Infinity;
  let timer = null;
  let pending = null;
  const invoke = (args) => {
    last = now();
    callback(...args);
  };
  const cancel = () => {
    if (timer !== null) clearTimer(timer);
    timer = null;
    pending = null;
  };
  const flush = () => {
    const args = pending;
    cancel();
    if (args) invoke(args);
  };
  const schedule = (...args) => {
    if (timer === null && now() - last >= wait) {
      if (leading) {
        invoke(args);
        return;
      }
      last = now();
    }
    if (!trailing) return;
    pending = args;
    if (timer === null) timer = setTimer(flush, Math.max(0, wait - (now() - last)));
  };
  return { schedule, flush, cancel };
}

/**
 * Runs `callback` at most once every `wait` ms while it keeps being called: for scroll, pointer
 * and resize handlers that should stay responsive without running on every event. Stable for a
 * given configuration, always calls the latest callback, and cancels pending work on unmount.
 */
export function useThrottleCallback(callback, wait = 200, { leading = true, trailing = true } = {}) {
  const callbackRef = useLatestRef(callback);
  const throttled = useMemo(() => {
    const throttler = createThrottler((...args) => callbackRef.current(...args), wait, { leading, trailing });
    return Object.assign((...args) => throttler.schedule(...args), { cancel: throttler.cancel, flush: throttler.flush });
  }, [ callbackRef, leading, trailing, wait ]);

  useEffect(() => () => throttled.cancel(), [ throttled ]);

  return throttled;
}
