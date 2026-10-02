'use client';

import { useEffect, useRef } from 'react';
import { resolveTarget } from '../shared/dom.js';
import { useLatestRef } from '../shared/use-latest-ref.js';

const normaliseOptions = (options) => (typeof options === 'boolean'
  ? { capture: options, once: false, passive: undefined, signal: undefined }
  : { capture: Boolean(options?.capture), once: Boolean(options?.once), passive: options?.passive, signal: options?.signal });

const sameOptions = (a, b) => a.capture === b.capture && a.once === b.once && a.passive === b.passive && a.signal === b.signal;

/**
 * Attach `handler` to `window` (default), `document`, an element or a ref, and remove it on unmount.
 * The latest handler always runs without re-subscribing. Refs are re-read after every commit, so a
 * listener follows a conditionally rendered element. Pass `null` as the target to detach.
 *
 * @param {string} eventName - DOM event name such as `'keydown'` or `'scroll'`.
 * @param {(event: Event) => void} handler
 * @param {'window' | 'document' | Element | { current: Element | null } | null} [target='window']
 * @param {boolean | AddEventListenerOptions} [options]
 */
export function useEventListener(eventName, handler, target = 'window', options) {
  const handlerRef = useLatestRef(handler);
  const subscription = useRef(null);

  // Reconcile after every commit; keep an unchanged subscription (including a consumed `once`).
  useEffect(() => {
    const element = target === null ? null : resolveTarget(target);
    const resolved = normaliseOptions(options);
    const previous = subscription.current;
    if (previous && previous.element === element && previous.eventName === eventName && sameOptions(previous.options, resolved)) return;

    previous?.remove();
    subscription.current = null;
    if (!element?.addEventListener) return;

    const listener = (event) => handlerRef.current?.(event);
    element.addEventListener(eventName, listener, resolved);
    subscription.current = {
      element,
      eventName,
      options: resolved,
      remove: () => element.removeEventListener(eventName, listener, resolved)
    };
  });

  useEffect(() => () => {
    subscription.current?.remove();
    subscription.current = null;
  }, []);
}
