'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from './use-event-listener.js';

/** Pointer coordinates in CSS pixels, coalesced once per frame. Attach ref for local coordinates. */
export function useMousePosition({ enabled = true } = {}) {
  const node = useRef(null);
  const frame = useRef(null);
  const pending = useRef(null);
  const [position, setPosition] = useState({ x: null, y: null, pageX: null, pageY: null, elementX: null, elementY: null, isInside: false });
  const ref = useCallback((element) => { node.current = element; }, []);
  useEventListener('pointermove', (event) => {
    pending.current = { x: event.clientX, y: event.clientY, pageX: event.pageX, pageY: event.pageY };
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const sample = pending.current;
      const bounds = node.current?.getBoundingClientRect();
      setPosition({ ...sample, elementX: bounds ? sample.x - bounds.left : null, elementY: bounds ? sample.y - bounds.top : null, isInside: Boolean(bounds && sample.x >= bounds.left && sample.x <= bounds.right && sample.y >= bounds.top && sample.y <= bounds.bottom) });
    });
  }, enabled ? 'window' : null, { passive: true });
  useEffect(() => () => { if (frame.current !== null) cancelAnimationFrame(frame.current); frame.current = null; }, [enabled]);
  return { ref, ...position };
}
