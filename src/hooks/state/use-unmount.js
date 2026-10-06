'use client';

import { useEffect } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';

/** Latest committed cleanup callback. React Strict Mode also runs this during its effect probe. */
export function useUnmount(callback) {
  const latest = useLatestRef(callback);
  useEffect(() => () => latest.current?.(), [latest]);
}
