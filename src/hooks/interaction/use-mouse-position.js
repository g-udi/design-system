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
    const bounds = node.current?.getBoundingClientRect();
    pending.current = { x: event.clientX, y: event.clientY, pageX: event.pageX, pageY: event.pageY, elementX: bounds ? event.clientX - bounds.left : null, elementY: bounds ? event.clientY - bounds.top : null, isInside: Boolean(bounds && event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom) };
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => { frame.current = null; setPosition(pending.current); });
  }, enabled ? 'window' : null, { passive: true });
  useEffect(() => () => { if (frame.current !== null) cancelAnimationFrame(frame.current); frame.current = null; }, [enabled]);
  return { ref, ...position };
}
