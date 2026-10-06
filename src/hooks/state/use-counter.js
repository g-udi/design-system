'use client';

import { useCallback, useState } from 'react';

/** Numeric state with functional updates and stable increment/decrement/reset actions. */
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = useCallback(() => setCount((value) => value + 1), []);
  const decrement = useCallback(() => setCount((value) => value - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  return { count, setCount, increment, decrement, reset };
}
