'use client';

import { useEffect, useState } from 'react';

/**
 * The vertical scroll offset in pixels of the page, or of the element in `targetRef`: sticky
 * headers that shrink, back-to-top buttons and reading progress. 0 during server rendering.
 * Listens passively, so it never delays scrolling.
 *
 * @param {{ targetRef?: { current: HTMLElement | null } }} [options]
 */
export function useScrollPosition({ targetRef } = {}) {
  const [ scrollPosition, setScrollPosition ] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const element = targetRef?.current || null;
    const scrollable = element || window;
    const update = () => setScrollPosition(element ? element.scrollTop : window.scrollY);
    scrollable.addEventListener('scroll', update, { passive: true });
    update();
    return () => scrollable.removeEventListener('scroll', update);
  }, [ targetRef ]);

  return scrollPosition;
}
