'use client';

import { useEffect } from 'react';
import { lockScroll } from './scroll-lock-model.js';

/**
 * Locks page scrolling while `locked` is true, for custom overlays, full-screen menus and
 * lightboxes. Locks from several components nest. Gaudi Dialog, Sheet and Drawer lock scrolling
 * themselves; do not add this hook to them.
 */
export function useScrollLock(locked = true) {
  useEffect(() => (locked ? lockScroll() : undefined), [ locked ]);
}
