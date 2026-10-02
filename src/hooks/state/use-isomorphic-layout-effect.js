import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` in the browser and `useEffect` on the server, so measure-before-paint code can
 * run in components that also render on the server.
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
