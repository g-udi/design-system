'use client';

import { useSyncExternalStore } from 'react';

const cache = {};

function detect(kind) {
  if (cache[kind] !== undefined) return cache[kind];
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext(kind, { failIfMajorPerformanceCaveat: true });
    cache[kind] = gl !== null;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cache[kind] = false;
  }
  return cache[kind];
}

const subscribe = () => () => {};

/** True when a hardware WebGL context is available; null while rendering on the server. */
export const useWebGLSupport = (kind = 'webgl') => useSyncExternalStore(subscribe, () => detect(kind), () => null);
