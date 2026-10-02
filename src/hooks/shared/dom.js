/**
 * Browser guards and DOM helpers shared by the hooks. Everything here is safe to import during
 * server rendering: no global is touched until a function is called.
 */

/** True in a browser, false during server rendering and in plain Node. */
export const canUseDOM = () => typeof window !== 'undefined' && typeof document !== 'undefined';

/** Resolve a ref, an element, `'window'` or `'document'` to an event target (or null). */
export function resolveTarget(target) {
  if (!canUseDOM()) return null;
  if (target === 'window') return window;
  if (target === 'document' || target === undefined) return document;
  if (target && typeof target === 'object' && 'current' in target) return target.current;
  return target || null;
}

/** Inputs whose native arrow, Home and End keys belong to the editor rather than its parent widget. */
export function isTextEntryTarget(target) {
  if (typeof Element === 'undefined' || !(target instanceof Element)) return false;
  if (target instanceof HTMLElement && target.isContentEditable) return true;
  return Boolean(target.closest(
    'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="spinbutton"], [role="slider"]'
  ));
}

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]:not([contenteditable="false"])'
].join(', ');

/** Visible, enabled and not hidden from assistive technology or interaction. */
export function isAvailableFocusTarget(element) {
  if (!element?.isConnected || element.closest('[hidden], [aria-hidden="true"], [inert]')) return false;
  for (let current = element; current; current = current.parentElement) {
    const style = getComputedStyle(current);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
  }
  return !element.hasAttribute('disabled');
}

/** Tabbable elements inside a container, in document order. */
export function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
    .filter((element) => element.tabIndex !== -1 && isAvailableFocusTarget(element));
}
