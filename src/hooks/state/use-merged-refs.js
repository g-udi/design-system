'use client';

import { useCallback } from 'react';

/** Assign `value` to a callback ref or an object ref. Returns the callback ref's cleanup, if any. */
export function assignRef(ref, value) {
  if (typeof ref === 'function') return ref(value);
  if (ref && typeof ref === 'object') ref.current = value;
  return undefined;
}

/** One callback ref that forwards a node to every ref passed in (callback or object refs). */
export function mergeRefs(...refs) {
  return (node) => {
    const cleanups = refs.map((ref) => assignRef(ref, node));
    if (!cleanups.some((cleanup) => typeof cleanup === 'function')) return undefined;
    // React 19 callback-ref cleanups: run each returned cleanup, and reset the other refs.
    return () => refs.forEach((ref, index) => {
      if (typeof cleanups[index] === 'function') cleanups[index]();
      else assignRef(ref, null);
    });
  };
}

/**
 * Combine a forwarded ref with the component's own ref (or any number of refs) into one stable
 * callback ref. The result only changes when one of the refs changes identity.
 */
export function useMergedRefs(...refs) {
  // The refs themselves are the dependencies; their count is fixed for a given call site.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(mergeRefs(...refs), refs);
}
