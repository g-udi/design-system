'use client';

import { useCallback, useEffect, useState } from 'react';
import { useInterval } from './use-interval.js';

/** Pausable count-down or count-up, stopping exactly at countStop. Reset uses current options. */
export function useCountdown({ countStart = 60, countStop = 0, intervalMs = 1000, isIncrement = false } = {}) {
  const [count, setCount] = useState(countStart);
  const [running, setRunning] = useState(false);
  const complete = isIncrement ? count >= countStop : count <= countStop;
  const validDelay = Number.isFinite(intervalMs) && intervalMs > 0;
  useInterval(() => setCount((value) => isIncrement ? Math.min(countStop, value + 1) : Math.max(countStop, value - 1)), running && !complete && validDelay ? intervalMs : null);
  useEffect(() => { if (complete || !validDelay) setRunning(false); }, [complete, validDelay]);
  const start = useCallback(() => { if (!complete && validDelay) setRunning(true); }, [complete, validDelay]);
  const stop = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => { setRunning(false); setCount(countStart); }, [countStart]);
  return { count, isRunning: running && !complete && validDelay, start, stop, reset };
}
