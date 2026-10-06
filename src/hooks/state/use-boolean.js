'use client';

import { useCallback, useMemo, useState } from 'react';

/** Generic on/off state. Use useDisclosure for controls that reveal another region. */
export function useBoolean(initialValue = false) {
  const [value, setState] = useState(() => Boolean(initialValue));
  const setValue = useCallback((next) => setState((current) => Boolean(typeof next === 'function' ? next(current) : next)), []);
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);
  const toggle = useCallback(() => setState((current) => !current), []);
  return useMemo(() => ({ value, setValue, setTrue, setFalse, toggle }), [value, setValue, setTrue, setFalse, toggle]);
}
