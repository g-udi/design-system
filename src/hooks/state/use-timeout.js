'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';

/**
 * Calls `callback` once, `delay` ms after mount or after `delay` changes. Pass `null` to hold it.
 * Returns `{ reset, clear }` to restart or cancel the timer, for example to dismiss a notice
 * unless the reader is interacting with it.
 */
export function useTimeout(callback, delay) {
  const callbackRef = useLatestRef(callback);
  const timerRef = useRef(null);

  const clear = useCallback(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const reset = useCallback(() => {
    clear();
    if (delay === null || delay === false || delay === undefined) return;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      callbackRef.current();
    }, delay);
  }, [ callbackRef, clear, delay ]);

  useEffect(() => {
    reset();
    return clear;
  }, [ clear, reset ]);

  return { reset, clear };
}
