'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { isTextEntryTarget } from '../shared/dom.js';
import { useEventListener } from './use-event-listener.js';
import { isApplePlatform, matchHotkey, parseHotkey, toAriaKeyShortcuts, toKbdKeys } from './hotkey-model.js';

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
