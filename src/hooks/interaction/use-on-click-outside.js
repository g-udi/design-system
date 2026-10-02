'use client';

import { useEventListener } from './use-event-listener.js';

/** True when `target` lies outside every ref'd node. Detached targets (removed mid-click) count as inside. */
export function isOutside(refs, target) {
  if (!target || (typeof target.isConnected === 'boolean' && !target.isConnected)) return false;
  return refs.every((ref) => !ref?.current || !ref.current.contains(target));
}

/**
 * Calls `handler` when a pointer press lands outside the referenced element(s): pass a ref or an
 * array of refs (for example a trigger and its panel). Use it for custom panels and inline
 * editors; Gaudi Popover, Dialog, Select and menus already dismiss themselves.
 *
 * @param {object | object[]} ref - Ref or refs whose nodes count as inside.
 * @param {(event: Event) => void} handler
 * @param {string | { event?: string, enabled?: boolean }} [options] - Event name (default
 *   `'pointerdown'`, also `'mousedown'`, `'mouseup'`, `'click'`, `'touchstart'`, `'focusin'`) or options.
 */
export function useOnClickOutside(ref, handler, options = {}) {
  const { event = 'pointerdown', enabled = true } = typeof options === 'string' ? { event: options } : options;

  useEventListener(event, (nativeEvent) => {
    const refs = Array.isArray(ref) ? ref : [ ref ];
    if (isOutside(refs, nativeEvent.target)) handler(nativeEvent);
  }, enabled ? 'document' : null);
}
