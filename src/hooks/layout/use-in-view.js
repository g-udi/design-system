'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';

/**
 * Whether an element is in the viewport (or in `root`), from an IntersectionObserver: lazy
 * sections, reading progress, "load more" sentinels and reveal-on-scroll. Returns
 * `[ref, inView, entry]`. With `once`, it stops observing after the first time the element is
 * seen. `initialInView` applies on the server and where IntersectionObserver is missing, so set it
 * to true for content that must render without JavaScript.
 */
export function useInView({ root = null, rootMargin = '0px', threshold = 0, once = false, initialInView = false, onChange } = {}) {
  const [ node, setNode ] = useState(null);
  const [ state, setState ] = useState({ inView: initialInView, entry: null });
  const onChangeRef = useLatestRef(onChange);
  const ref = useCallback((element) => setNode(element), []);
  const thresholdKey = Array.isArray(threshold) ? threshold.join(',') : threshold;
  const done = once && state.inView;

  useEffect(() => {
    if (!node || done) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setState((current) => (current.inView ? current : { inView: true, entry: null }));
      return undefined;
    }
    const observer = new IntersectionObserver(([ entry ]) => {
      if (!entry) return;
      setState((current) => (current.inView === entry.isIntersecting && current.entry === entry ? current : { inView: entry.isIntersecting, entry }));
      onChangeRef.current?.(entry.isIntersecting, entry);
      if (once && entry.isIntersecting) observer.disconnect();
    }, { root, rootMargin, threshold: typeof thresholdKey === 'string' ? thresholdKey.split(',').map(Number) : thresholdKey });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ done, node, onChangeRef, once, root, rootMargin, thresholdKey ]);

  return [ ref, state.inView, state.entry ];
}
