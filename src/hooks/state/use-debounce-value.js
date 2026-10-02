'use client';

import { useEffect, useState } from 'react';

/**
 * `value`, but only once it has stopped changing for `delay` ms. Use it to filter, fetch or
 * validate from fast input without running the work on every keystroke.
 */
export function useDebounceValue(value, delay = 300) {
  const [ debounced, setDebounced ] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(() => value), delay);
    return () => clearTimeout(timer);
  }, [ value, delay ]);

  return debounced;
}
