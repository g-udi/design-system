'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { announce, clearTimers, ensureRegion, regions } from './live-announcer-model.js';

let consumers = 0;

/**
 * Screen reader announcements for changes that happen away from focus: "Saved", "3 results",
 * "Copied to clipboard", "Upload failed". The live regions are created on mount, before the first
 * message, so the first announcement is not lost; they are removed when the last caller unmounts.
 *
 * @returns {{ announce: (message: string, politeness?: 'polite' | 'assertive') => void, clear: () => void }}
 */
export function useLiveAnnouncer({ clearAfter = 5000 } = {}) {
  useEffect(() => {
    consumers += 1;
    ensureRegion('polite');
    ensureRegion('assertive');
    return () => {
      consumers -= 1;
      if (consumers > 0) return;
      for (const level of [ 'polite', 'assertive' ]) {
        clearTimers(level);
        regions[level]?.remove();
        regions[level] = null;
      }
    };
  }, []);

  const say = useCallback((message, politeness = 'polite') => announce(message, politeness, { clearAfter }), [ clearAfter ]);
  const clear = useCallback(() => {
    for (const level of [ 'polite', 'assertive' ]) {
      clearTimers(level);
      if (regions[level]) regions[level].textContent = '';
    }
  }, []);

  return useMemo(() => ({ announce: say, clear }), [ clear, say ]);
}
