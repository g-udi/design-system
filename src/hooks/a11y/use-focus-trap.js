'use client';

import { useEffect, useRef } from 'react';
import { getFocusableElements, isAvailableFocusTarget } from '../shared/dom.js';
import { getTrapTarget } from './focus-trap-model.js';

// Active traps, innermost last. Nested traps hand Tab to the one that contains focus.
const activeTraps = [];

// Portaled floating layers (menus, listboxes, nested dialogs) own focus while they are open.
const FLOATING_FOCUS_SELECTOR = '[data-radix-popper-content-wrapper], [role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"], [role="listbox"], [role="menu"]';

function focusedTrap() {
  const containing = activeTraps.filter((trap) => trap.current?.contains(document.activeElement));
  return containing.find((trap) => !containing.some((other) => other !== trap && other.current && trap.current?.contains(other.current)));
}

/**
 * Keeps Tab and Shift+Tab inside a container while `active` is true, for custom overlays such as
 * a full-screen menu, lightbox or command bar. On activation it focuses the first tabbable element
 * (or the container with `initialFocus: 'container'`, which then needs `tabIndex={-1}`), and on
 * release it returns focus to where it was. Traps nest. Gaudi Dialog, Dialog confirmation, Sheet and
 * Drawer already trap focus.
 *
 * @returns {{ current: HTMLElement | null }} The ref to attach to the container (or `containerRef` when passed).
 */
export function useFocusTrap({ active = true, autoFocus = true, initialFocus = 'first', returnFocus = true, containerRef: providedRef } = {}) {
  const fallbackRef = useRef(null);
  const containerRef = providedRef ?? fallbackRef;

  useEffect(() => {
    if (!active || typeof document === 'undefined') return undefined;
    const container = containerRef.current;
    // Child effects run first: keep a physically nested trap above its ancestor.
    const descendant = activeTraps.findIndex((trap) => trap.current && container?.contains(trap.current));
    if (descendant >= 0) activeTraps.splice(descendant, 0, containerRef);
    else activeTraps.push(containerRef);
    const previouslyFocused = document.activeElement;
    let frame;

    if (autoFocus && container) {
      frame = requestAnimationFrame(() => {
        if (!isAvailableFocusTarget(container)) return;
        const owner = focusedTrap();
        // A nested trap may already have focused itself; do not steal it back.
        if (document.activeElement !== previouslyFocused && owner && owner !== containerRef) return;
        const elements = getFocusableElements(container);
        if (initialFocus === 'container' || !elements.length) container.focus();
        else elements[0].focus();
      });
    }

    const onKeyDown = (event) => {
      if (event.key !== 'Tab' || event.defaultPrevented || (focusedTrap() ?? activeTraps.at(-1)) !== containerRef) return;
      const node = containerRef.current;
      if (!node || !isAvailableFocusTarget(node)) return;
      if (!node.contains(document.activeElement) && document.activeElement?.closest(FLOATING_FOCUS_SELECTOR)) return;
      const elements = getFocusableElements(node);
      if (!elements.length) {
        event.preventDefault();
        return;
      }
      const target = getTrapTarget(elements, document.activeElement, event.shiftKey);
      if (target) {
        event.preventDefault();
        target.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      const index = activeTraps.lastIndexOf(containerRef);
      if (index >= 0) activeTraps.splice(index, 1);
      document.removeEventListener('keydown', onKeyDown);
      if (frame !== undefined) cancelAnimationFrame(frame);
      if (returnFocus && previouslyFocused instanceof HTMLElement && isAvailableFocusTarget(previouslyFocused)
        && (document.activeElement === document.body || !document.activeElement || container?.contains(document.activeElement) || !container?.isConnected)) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [ active, autoFocus, initialFocus, returnFocus, containerRef ]);

  return containerRef;
}
