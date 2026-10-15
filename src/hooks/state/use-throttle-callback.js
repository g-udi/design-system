'use client';

import { useEffect, useMemo } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';
import { createThrottler } from './throttle-model.js';

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
