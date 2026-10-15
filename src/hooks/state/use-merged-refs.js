'use client';

import { useCallback } from 'react';
import { mergeRefs } from './merged-refs-model.js';

/**
 * Combine a forwarded ref with the component's own ref (or any number of refs) into one stable
 * callback ref. The result only changes when one of the refs changes identity.
 */
export function useMergedRefs(...refs) {
  // The refs themselves are the dependencies; their count is fixed for a given call site.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(mergeRefs(...refs), refs);
}
