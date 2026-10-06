'use client';

import { useCallback, useEffect, useRef } from 'react';

/** Stable getter for committed mount state; does not trigger renders or cancel async work. */
export function useIsMounted() {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  return useCallback(() => mounted.current, []);
}
