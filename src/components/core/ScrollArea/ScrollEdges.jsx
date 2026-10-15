'use client';

import { useEffect, useState } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { useEventListener } from '../../../hooks/interaction/use-event-listener.js';

// An edge reaches full strength `range` pixels before the content ends in that direction.
const strength = (distance, range) => (distance < 1 ? 0 : Math.min(1, distance / range));

/**
 * Soft blurred edges where more content continues beyond a scroll boundary: the element in
 * `targetRef`, or the page when omitted. Page edges are fixed to the window; `offsetTop` keeps the
 * top edge below a sticky header; `edges` limits the effect to the top or bottom. Decorative only:
 * hidden while anything has keyboard focus, for reduced motion and in forced colours.
 */
function ScrollEdges({ targetRef, offsetTop = 0, range = 80, edges = 'both', className }) {
  const [ strengths, setStrengths ] = useState({ top: 0, bottom: 0 });
  const measure = () => {
    const element = targetRef ? targetRef.current : document.documentElement;
    if (!element) return;
    const scrolled = targetRef ? element.scrollTop : window.scrollY;
    const visible = targetRef ? element.clientHeight : window.innerHeight;
    setStrengths({ top: strength(scrolled, range), bottom: strength(element.scrollHeight - visible - scrolled, range) });
  };
  useEventListener('scroll', measure, targetRef ?? 'window', { passive: true });
  useEventListener('resize', measure, 'window', { passive: true });
  // Content that loads or reflows changes the remaining distance without a scroll.
  useEffect(() => {
    measure();
    const content = targetRef ? targetRef.current?.firstElementChild : document.body;
    if (!content || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [ targetRef ]); // eslint-disable-line react-hooks/exhaustive-deps

  const page = !targetRef;
  return (edges === 'both' ? [ 'top', 'bottom' ] : [ edges ]).map((edge) => (
    <div
      key={edge}
      aria-hidden='true'
      data-slot='scroll-edge'
      data-edge={edge}
      data-page={page ? '' : undefined}
      className={cn('ds-part-scroll-edge', className)}
      style={{ opacity: strengths[edge], ...(page && edge === 'top' ? { top: offsetTop } : null) }}
    />
  ));
}

export { ScrollEdges };
