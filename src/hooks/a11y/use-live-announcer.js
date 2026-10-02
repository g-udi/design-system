'use client';

import { useCallback, useEffect, useMemo } from 'react';

const VISUALLY_HIDDEN = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: '0',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: '0'
};
// Shared by every caller: one polite and one assertive region per document.
const regions = { polite: null, assertive: null };
const timers = { polite: [], assertive: [] };
let consumers = 0;

const clearTimers = (politeness) => {
  timers[politeness].forEach(clearTimeout);
  timers[politeness] = [];
};

function ensureRegion(politeness) {
  if (typeof document === 'undefined' || !document.body) return null;
  if (regions[politeness]?.isConnected) return regions[politeness];
  const region = document.createElement('div');
  region.setAttribute('aria-live', politeness);
  region.setAttribute('aria-atomic', 'true');
  region.setAttribute('aria-relevant', 'additions text');
  region.setAttribute('data-gaudi-live-announcer', politeness);
  Object.assign(region.style, VISUALLY_HIDDEN);
  document.body.appendChild(region);
  regions[politeness] = region;
  return region;
}

/**
 * Announce `message` through a shared visually hidden live region. `'polite'` waits for the screen
 * reader to finish; `'assertive'` interrupts and is for errors and time-critical changes only.
 * Repeating the same message announces it again. The message clears after `clearAfter` ms.
 */
export function announce(message, politeness = 'polite', { clearAfter = 5000 } = {}) {
  const level = politeness === 'assertive' ? 'assertive' : 'polite';
  const region = ensureRegion(level);
  if (!region || message == null || message === '') return;
  clearTimers(level);
  region.textContent = '';
  // Setting the text in a later task lets an identical message be read again.
  timers[level].push(setTimeout(() => {
    region.textContent = String(message);
    if (clearAfter) timers[level].push(setTimeout(() => {
      region.textContent = '';
    }, clearAfter));
  }, 60));
}

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
