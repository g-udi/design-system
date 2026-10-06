'use client';

import { useEffect, useState } from 'react';
import { useEventListener } from '../interaction/use-event-listener.js';

/**
 * The vertical scroll offset in pixels of the page, or of the element in `targetRef`: sticky
 * headers that shrink, back-to-top buttons and reading progress. 0 during server rendering.
 * Listens passively, so it never delays scrolling.
 *
 * @param {{ targetRef?: { current: HTMLElement | null } }} [options]
 */
export function useScrollPosition({ targetRef } = {}) {
  const [ scrollPosition, setScrollPosition ] = useState(0);

  const update = () => setScrollPosition(targetRef ? targetRef.current?.scrollTop ?? 0 : window.scrollY);
  useEventListener('scroll', update, targetRef ?? 'window', { passive: true });

  // The same ref can point to a replacement scroller after any host commit.
  useEffect(update);

  return scrollPosition;
}
