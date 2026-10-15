/** The shared live regions behind useLiveAnnouncer. No global is touched until a function is called, so this module is server-safe. */

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
export const regions = { polite: null, assertive: null };
const timers = { polite: [], assertive: [] };

export const clearTimers = (politeness) => {
  timers[politeness].forEach(clearTimeout);
  timers[politeness] = [];
};

export function ensureRegion(politeness) {
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
