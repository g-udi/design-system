'use client';

import { useCallback } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';

/**
 * A stable function that always calls the latest `callback`. Pass it to effects, memoised children
 * or subscriptions without adding the callback to their dependencies. Call it from events and
 * effects, not during render (during render it may still point at the previous callback).
 */
export function useEventCallback(callback) {
  const callbackRef = useLatestRef(callback);
  return useCallback((...args) => callbackRef.current?.(...args), [callbackRef]);
}
