'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { isTextEntryTarget } from '../shared/dom.js';
import { useEventListener } from './use-event-listener.js';

const KEY_ALIASES = {
  esc: 'escape',
  return: 'enter',
  space: ' ',
  spacebar: ' ',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  del: 'delete',
  plus: '+'
};
const ARIA_NAMES = { ' ': 'Space', arrowup: 'ArrowUp', arrowdown: 'ArrowDown', arrowleft: 'ArrowLeft', arrowright: 'ArrowRight', escape: 'Escape', enter: 'Enter', delete: 'Delete', backspace: 'Backspace', tab: 'Tab', home: 'Home', end: 'End', pageup: 'PageUp', pagedown: 'PageDown' };
const KBD_NAMES = { ' ': 'space', arrowup: 'up', arrowdown: 'down', arrowleft: 'left', arrowright: 'right' };

/**
 * Parse a combination such as `'mod+k'`, `'shift+?'` or `'escape'` into its key and modifiers.
 * `mod` is Command on Apple platforms and Control elsewhere.
 */
export function parseHotkey(combo) {
  const parts = String(combo).toLowerCase().split('+').map((part) => part.trim());
  // 'mod++' and 'shift++' name the plus key itself.
  const raw = parts.at(-1) === '' && parts.length > 1 ? '+' : parts.at(-1);
  const modifiers = new Set(parts.slice(0, raw === '+' && parts.at(-1) === '' ? -2 : -1));
  return {
    key: KEY_ALIASES[raw] ?? raw,
    mod: modifiers.has('mod'),
    ctrl: modifiers.has('ctrl') || modifiers.has('control'),
    meta: modifiers.has('meta') || modifiers.has('cmd') || modifiers.has('command'),
    alt: modifiers.has('alt') || modifiers.has('option'),
    shift: modifiers.has('shift')
  };
}

/** Best-effort Apple platform detection; false during server rendering. */
export function isApplePlatform() {
  if (typeof navigator === 'undefined') return false;
  const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || '';
  return /mac|iphone|ipad|ipod/i.test(platform);
}

const codeFor = (key) => (/^[a-z]$/.test(key) ? `Key${key.toUpperCase()}` : /^[0-9]$/.test(key) ? `Digit${key}` : null);

/** Whether a keyboard event matches `combo`. Letter keys also match by `event.code`, so Option combinations work on macOS. */
export function matchHotkey(event, combo, { apple = isApplePlatform() } = {}) {
  const hotkey = typeof combo === 'string' ? parseHotkey(combo) : combo;
  const wantMeta = hotkey.meta || (hotkey.mod && apple);
  const wantCtrl = hotkey.ctrl || (hotkey.mod && !apple);
  if (Boolean(event.metaKey) !== wantMeta || Boolean(event.ctrlKey) !== wantCtrl || Boolean(event.altKey) !== hotkey.alt) return false;
  const symbol = hotkey.key.length === 1 && !/[a-z0-9 ]/.test(hotkey.key);
  // Symbols such as '?' already imply Shift on most layouts, so Shift is only checked for named and alphanumeric keys.
  if (!symbol && Boolean(event.shiftKey) !== hotkey.shift) return false;
  const key = String(event.key || '').toLowerCase();
  return key === hotkey.key || (codeFor(hotkey.key) !== null && event.code === codeFor(hotkey.key));
}

/** The `aria-keyshortcuts` value: `'mod+k'` becomes `'Meta+K Control+K'` (stable on server and client). */
export function toAriaKeyShortcuts(combos) {
  return [].concat(combos).flatMap((combo) => {
    const hotkey = parseHotkey(combo);
    const key = ARIA_NAMES[hotkey.key] || (hotkey.key.length === 1 ? hotkey.key.toUpperCase() : hotkey.key[0].toUpperCase() + hotkey.key.slice(1));
    const rest = [ hotkey.alt && 'Alt', hotkey.shift && 'Shift', key ].filter(Boolean);
    const variants = hotkey.mod ? [ [ 'Meta' ], [ 'Control' ] ] : [ [ hotkey.ctrl && 'Control', hotkey.meta && 'Meta' ].filter(Boolean) ];
    return variants.map((modifiers) => [ ...modifiers, ...rest ].join('+'));
  }).join(' ');
}

/** Keys for the Gaudi `Kbd` component: `'mod+shift+p'` becomes `'command,shift,p'` on Apple platforms and `'ctrl,shift,p'` elsewhere. */
export function toKbdKeys(combo, { apple = isApplePlatform() } = {}) {
  const hotkey = parseHotkey(combo);
  return [
    (hotkey.meta || (hotkey.mod && apple)) && 'command',
    (hotkey.ctrl || (hotkey.mod && !apple)) && 'ctrl',
    hotkey.alt && (apple ? 'option' : 'alt'),
    hotkey.shift && 'shift',
    KBD_NAMES[hotkey.key] || hotkey.key
  ].filter(Boolean).join(',');
}

const noopSubscribe = () => () => {};

/**
 * Run `callback` when a keyboard shortcut is pressed. `keys` is a combination or a list of them,
 * such as `'mod+k'` (Command+K on macOS, Control+K elsewhere), `'shift+?'` or `'escape'`. While the
 * reader types in a field the shortcut is skipped, unless it uses Command, Control or Alt or
 * `enableInInputs` is set. Returns `ariaKeyShortcuts` for the control the shortcut triggers and
 * `kbdKeys` for a `Kbd` hint (non-Apple until hydration, then the reader's platform).
 */
export function useHotkey(keys, callback, {
  enabled = true,
  target = 'document',
  event = 'keydown',
  preventDefault = true,
  enableInInputs = false,
  allowRepeat = false
} = {}) {
  const combos = useMemo(() => [].concat(keys), [ keys ]);
  const apple = useSyncExternalStore(noopSubscribe, isApplePlatform, () => false);

  useEventListener(event, (nativeEvent) => {
    if (nativeEvent.defaultPrevented || nativeEvent.isComposing || (nativeEvent.repeat && !allowRepeat)) return;
    const combo = combos.find((candidate) => matchHotkey(nativeEvent, candidate, { apple }));
    if (!combo) return;
    const parsed = parseHotkey(combo);
    const chord = parsed.mod || parsed.ctrl || parsed.meta || parsed.alt;
    if (!enableInInputs && !chord && isTextEntryTarget(nativeEvent.target)) return;
    if (preventDefault) nativeEvent.preventDefault();
    callback(nativeEvent, combo);
  }, enabled ? target : null);

  return useMemo(() => ({
    ariaKeyShortcuts: toAriaKeyShortcuts(combos),
    kbdKeys: toKbdKeys(combos[0], { apple })
  }), [ apple, combos ]);
}
