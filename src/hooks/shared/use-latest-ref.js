'use client';

import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../state/use-isomorphic-layout-effect.js';

/**
 * A ref that always holds the latest value, updated after commit. Lets effects and stable callbacks
 * read the current handler without re-subscribing whenever an inline function changes identity.
 */
export function useLatestRef(value) {
  const ref = useRef(value);
  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
