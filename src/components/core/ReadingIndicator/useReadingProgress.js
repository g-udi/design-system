'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from '../../../hooks/interaction/use-event-listener.js';
import { observeResize } from '../../../utilities/observeResize.js';
import { clampReadingValue, readingProgress } from './readingProgress.js';

export function useReadingProgress({ targetRef, contentRef, value }) {
  const controlled = value !== undefined;
  const [progress, setProgress] = useState(0);
  const subscription = useRef(null);
  const scrollTarget = useRef(null);
  const frame = useRef(null);

  const measure = useCallback(() => {
    const root = subscription.current?.root;
    if (!root) return setProgress(0);
    const page = root === document.scrollingElement;
    const position = page ? window.scrollY : root.scrollTop;
    const height = page ? document.documentElement.clientHeight : root.clientHeight;
    const end = Math.max(0, root.scrollHeight - height);
    const content = contentRef?.current;
    if (contentRef && !content) return setProgress(0);
    if (!content) return setProgress(readingProgress(position, 0, end));
    const bounds = content.getBoundingClientRect();
    const top = bounds.top + position - (page ? 0 : root.getBoundingClientRect().top + root.clientTop);
    setProgress(readingProgress(position, Math.max(0, top), Math.min(end, top + bounds.height - height)));
  }, [contentRef]);
  const schedule = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      measure();
    });
  }, [measure]);

  // Wait for every sibling ref to attach: a header can precede its scroll viewport.
  // Reconcile after host commits, including a stable ref pointing to a replacement viewport.
  useEffect(() => {
    const target = targetRef?.current;
    const viewport = target?.getAttribute?.('data-slot') === 'scroll-area'
      ? target.querySelector(':scope > [data-slot="scroll-area-viewport"]')
      : target;
    const root = controlled ? null : targetRef ? viewport : document.scrollingElement;
    const content = contentRef?.current;
    const previous = subscription.current;
    if (previous?.root !== root || previous?.content !== content || previous?.schedule !== schedule) {
      previous?.disconnect();
      subscription.current = null;
      scrollTarget.current = root === document.scrollingElement ? window : root;
      if (root) {
        const resize = typeof ResizeObserver === 'undefined' ? null : observeResize(schedule);
        const observe = () => {
          resize?.disconnect();
          new Set([root, ...root.children, content].filter(Boolean)).forEach(node => resize?.observe(node));
        };
        observe();
        const mutations = new MutationObserver(() => { observe(); schedule(); });
        mutations.observe(root, { childList: true, subtree: true, characterData: true });
        subscription.current = { root, content, schedule, disconnect: () => { resize?.disconnect(); mutations.disconnect(); } };
      }
    }
    if (!controlled) schedule();
  });
  useEventListener('scroll', schedule, scrollTarget, { passive: true });
  useEventListener('resize', schedule, controlled ? null : 'window', { passive: true });
  useEffect(() => () => {
    subscription.current?.disconnect();
    subscription.current = null;
    cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);
  return controlled ? clampReadingValue(value) : progress;
}
