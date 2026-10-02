'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';

/**
 * Hover state from pointer events, returned with the props to spread on the element. Touch
 * pointers are ignored (a tap would leave the element stuck "hovered"), and the state clears when
 * `disabled` turns on. Hover is an enhancement: anything revealed on hover must also be reachable
 * by focus or a click.
 */
export function useHover({ disabled = false, onHoverChange } = {}) {
  const [ hovered, setHovered ] = useState(false);
  const callbackRef = useLatestRef(onHoverChange);
  const isHovered = hovered && !disabled;

  const hoveredRef = useRef(false);

  const update = useCallback((next) => {
    if (hoveredRef.current === next) return;
    hoveredRef.current = next;
    setHovered(next);
    callbackRef.current?.(next);
  }, [ callbackRef ]);

  const hoverProps = useMemo(() => ({
    onPointerEnter: (event) => {
      if (!disabled && event.pointerType !== 'touch') update(true);
    },
    onPointerLeave: (event) => {
      if (event.pointerType !== 'touch') update(false);
    }
  }), [ disabled, update ]);

  return { isHovered, hoverProps };
}
