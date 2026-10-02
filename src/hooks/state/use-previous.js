'use client';

import { useState } from 'react';

/**
 * The value `value` held before it last changed: `initial` (default `undefined`) until the first
 * change. Re-renders with an unchanged value keep the same previous value, so comparisons such as
 * "went up" or "went down" stay stable. Tracked in state, so it is safe under concurrent rendering.
 */
export function usePrevious(value, initial = undefined) {
  const [ state, setState ] = useState({ current: value, previous: initial });
  if (!Object.is(state.current, value)) {
    const next = { current: value, previous: state.current };
    setState(next);
    return next.previous;
  }
  return state.previous;
}
