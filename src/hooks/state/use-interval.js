'use client';

import { useEffect } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';

const isPaused = (delay) => delay === null || delay === false || delay === undefined;

/**
 * Calls `callback` every `delay` ms. Pass `null` (or `false`) as the delay to pause. The latest
 * callback always runs, so it can read fresh state without restarting the interval.
 */
export function useInterval(callback, delay) {
  const callbackRef = useLatestRef(callback);

  useEffect(() => {
    if (isPaused(delay)) return undefined;
    const id = setInterval(() => callbackRef.current(), delay);
    return () => clearInterval(id);
  }, [ callbackRef, delay ]);
}
