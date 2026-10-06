'use client';

import { useState } from 'react';
import { useEventListener } from '../interaction/use-event-listener.js';
import { useInterval } from '../state/use-interval.js';

/** Clock shared by scheduling surfaces; refresh on return as well as on the interval. */
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());
  const tick = () => setNow(new Date());
  useInterval(tick, intervalMs);
  useEventListener('visibilitychange', tick, 'document');
  useEventListener('focus', tick);
  return now;
}
