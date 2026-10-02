'use client';

import { useState } from 'react';
import { useIsomorphicLayoutEffect } from '../../../../../hooks/state/use-isomorphic-layout-effect.js';
import { isHex } from './voice-orb-model.js';

// Server and first-paint values (the light accent, chart-7, danger and chart-5 tokens), replaced by
// the scoped tokens as soon as the orb mounts.
const FALLBACK = { from: '#2563eb', to: '#9333ea', errorFrom: '#b91c1c', errorTo: '#be123c' };

/**
 * Resolves the orb's artwork colours from scoped Gaudi tokens (`--ds-voice-<palette>-from/to` and
 * `--ds-voice-error-from/to`, which point at colour tokens), so the orb follows the theme. Renderers
 * interpolate RGB channels, so overrides must be #RGB or #RRGGBB. Re-reads when a class, style or
 * theme attribute on the orb or an ancestor changes, without polling.
 */
export function useVoiceOrbColors(hostRef, palette, requestedFrom, requestedTo) {
  const [ colors, setColors ] = useState(() => ({
    colorFrom: isHex(requestedFrom) ? requestedFrom : FALLBACK.from,
    colorTo: isHex(requestedTo) ? requestedTo : FALLBACK.to,
    errorFrom: FALLBACK.errorFrom,
    errorTo: FALLBACK.errorTo
  }));

  useIsomorphicLayoutEffect(() => {
    const host = hostRef.current;
    if (!host || typeof getComputedStyle === 'undefined') return undefined;
    const refresh = () => {
      const style = getComputedStyle(host);
      const token = (name, backup) => {
        const value = style.getPropertyValue(name).trim();
        return isHex(value) ? value : backup;
      };
      const next = {
        colorFrom: isHex(requestedFrom) ? requestedFrom : token(`--ds-voice-${palette}-from`, FALLBACK.from),
        colorTo: isHex(requestedTo) ? requestedTo : token(`--ds-voice-${palette}-to`, FALLBACK.to),
        errorFrom: token('--ds-voice-error-from', FALLBACK.errorFrom),
        errorTo: token('--ds-voice-error-to', FALLBACK.errorTo)
      };
      setColors((previous) => (Object.keys(next).every((key) => previous[key] === next[key]) ? previous : next));
    };
    refresh();
    if (typeof MutationObserver === 'undefined') return undefined;
    const observer = new MutationObserver(refresh);
    for (let node = host; node; node = node.parentElement) {
      observer.observe(node, { attributes: true, attributeFilter: [ 'class', 'style', 'data-theme' ] });
    }
    return () => observer.disconnect();
  }, [ hostRef, palette, requestedFrom, requestedTo ]);

  return colors;
}
