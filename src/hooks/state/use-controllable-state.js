'use client';

import { useCallback, useRef, useState } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';

/**
 * State that a component owns until its host passes `value`. Controlled when `value` is defined:
 * the host may accept, refuse or replace each change offered through `onChange`. Uncontrolled
 * otherwise, starting from `defaultValue`. The setter accepts a value or an updater function and
 * skips changes that are `Object.is` equal to the current value.
 *
 * @returns {[any, (next: any | ((current: any) => any)) => void]}
 */
export function useControllableState({ value, defaultValue, onChange } = {}) {
  const [ inner, setInner ] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const currentRef = useRef(current);
  currentRef.current = current;
  const onChangeRef = useLatestRef(onChange);

  const setValue = useCallback((next) => {
    const resolved = typeof next === 'function' ? next(currentRef.current) : next;
    if (Object.is(resolved, currentRef.current)) return;
    // Only advance owned state. The host can refuse a controlled change without
    // rerendering, so subsequent requests must still start from its actual value.
    if (!controlled) {
      currentRef.current = resolved;
      setInner(resolved);
    }
    onChangeRef.current?.(resolved);
  }, [ controlled, onChangeRef ]);

  return [ current, setValue ];
}
