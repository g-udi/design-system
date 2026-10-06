'use client';
import { useState } from 'react';
import { Direction } from 'radix-ui';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';

const readDir = (element) => {
  const value = element?.getAttribute('dir');
  return value === 'rtl' || value === 'ltr' ? value : undefined;
};

/**
 * Resolves a component's reading direction: an explicit `dir` wins, then the nearest ancestor `dir`
 * attribute in the document (read after mount, starting above `ref` so the component's own `dir`
 * never feeds back), then `DirectionProvider`, then `ltr`. The server and first client render use
 * the provider value, so markup stays deterministic.
 */
export function useResolvedDirection(dir, ref) {
  const providerDir = Direction.useDirection();
  const [documentDir, setDocumentDir] = useState();

  useIsomorphicLayoutEffect(() => {
    if (dir) return;
    const start = ref?.current?.parentElement;
    const owner = start?.closest('[dir]') ?? document.documentElement;
    setDocumentDir(readDir(owner) ?? readDir(document.documentElement));
  });

  return dir || documentDir || providerDir;
}
