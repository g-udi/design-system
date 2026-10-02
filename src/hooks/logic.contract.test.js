import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextIndex } from './a11y/use-arrow-key-nav.js';
import { getTrapTarget } from './a11y/use-focus-trap.js';
import { announce } from './a11y/use-live-announcer.js';
import { createStorageStore } from './data/storage-state.js';
import { selectionState, toggleInSet } from './data/use-selection.js';
import { matchesMediaQuery, subscribeMediaQuery } from './environment/use-media-query.js';
import { writeToClipboard } from './interaction/use-copy-to-clipboard.js';
import { matchHotkey, parseHotkey, toAriaKeyShortcuts, toKbdKeys } from './interaction/use-hotkey.js';
import { isOutside } from './interaction/use-on-click-outside.js';
import { lockScroll } from './interaction/use-scroll-lock.js';
import { areAllSectionsExpanded, collapsibleSectionsReducer, createCollapsibleSectionsState } from './layout/collapsible-sections-model.js';
import { createDebouncer } from './state/use-debounce-callback.js';
import { assignRef, mergeRefs } from './state/use-merged-refs.js';
import { clampStep } from './state/use-step.js';
import { createThrottler } from './state/use-throttle-callback.js';

// MARK: A11y

test('arrow navigation follows orientation, Home/End, wrapping and right-to-left', () => {
  const list = { count: 4 };
  assert.equal(getNextIndex(0, 'ArrowDown', list), 1);
  assert.equal(getNextIndex(0, 'ArrowRight', list), null, 'vertical ignores horizontal keys');
  assert.equal(getNextIndex(0, 'ArrowUp', list), 0, 'clamped without wrap');
  assert.equal(getNextIndex(0, 'ArrowUp', { ...list, wrap: true }), 3);
  assert.equal(getNextIndex(3, 'ArrowDown', { ...list, wrap: true }), 0);
  assert.equal(getNextIndex(2, 'Home', list), 0);
  assert.equal(getNextIndex(0, 'End', list), 3);
  assert.equal(getNextIndex(1, 'ArrowRight', { ...list, orientation: 'horizontal' }), 2);
  assert.equal(getNextIndex(1, 'ArrowLeft', { ...list, orientation: 'horizontal', dir: 'rtl' }), 2);
  assert.equal(getNextIndex(1, 'ArrowDown', { ...list, orientation: 'both' }), 2);
  assert.equal(getNextIndex(0, 'Enter', list), null);
  assert.equal(getNextIndex(0, 'ArrowDown', { count: 0 }), null);
});

test('the focus trap wraps at both ends and pulls stray focus back in', () => {
  const [ a, b, c ] = [ {}, {}, {} ];
  assert.equal(getTrapTarget([ a, b, c ], c, false), a);
  assert.equal(getTrapTarget([ a, b, c ], a, true), c);
  assert.equal(getTrapTarget([ a, b, c ], b, false), null, 'the browser moves focus inside the trap');
  assert.equal(getTrapTarget([ a, b, c ], {}, false), a);
  assert.equal(getTrapTarget([ a, b, c ], {}, true), c);
  assert.equal(getTrapTarget([], a, false), null);
});

test('announcing on the server is a no-op', () => {
  assert.doesNotThrow(() => announce('Saved'));
});

// MARK: Data

function fakeStorage({ failWrites = false } = {}) {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => {
      if (failWrites) throw new Error('QuotaExceededError');
      map.set(key, String(value));
    },
    removeItem: (key) => map.delete(key),
    map
  };
}

test('the storage store reads, writes, removes and notifies subscribers of the same key', () => {
  const storage = fakeStorage();
  const store = createStorageStore(() => storage);
  let heard = 0;
  const stop = store.subscribe('theme', () => heard++);
  store.subscribe('other', () => assert.fail('wrong key notified'));
  store.set('theme', '"dark"');
  assert.equal(store.get('theme'), '"dark"');
  assert.equal(storage.map.get('theme'), '"dark"');
  store.remove('theme');
  assert.equal(store.get('theme'), null);
  assert.equal(heard, 2);
  stop();
  store.set('theme', '"light"');
  assert.equal(heard, 2, 'unsubscribed listeners stay quiet');
});

test('the storage store falls back to memory when storage is missing or refuses writes', () => {
  const missing = createStorageStore(() => null);
  missing.set('k', '1');
  assert.equal(missing.get('k'), '1');
  const throwing = createStorageStore(() => {
    throw new Error('SecurityError');
  });
  throwing.set('k', '2');
  assert.equal(throwing.get('k'), '2');
  const full = createStorageStore(() => fakeStorage({ failWrites: true }));
  full.set('k', '3');
  assert.equal(full.get('k'), '3', 'a refused write keeps the value for the session');
});

test('selection helpers produce new Sets and a select-all state', () => {
  const start = new Set([ 1 ]);
  const next = toggleInSet(start, 2);
  assert.notEqual(next, start);
  assert.deepEqual([ ...next ], [ 1, 2 ]);
  assert.deepEqual([ ...toggleInSet(next, 1) ], [ 2 ]);
  assert.equal(selectionState(new Set(), [ 1, 2 ]), false);
  assert.equal(selectionState(new Set([ 1 ]), [ 1, 2 ]), 'indeterminate');
  assert.equal(selectionState(new Set([ 1, 2, 3 ]), [ 1, 2 ]), true);
  assert.equal(selectionState(new Set([ 1 ]), []), false);
});

// MARK: Environment and interaction

test('media query helpers are inert without matchMedia', () => {
  assert.equal(matchesMediaQuery('(min-width: 1px)'), false);
  const unsubscribe = subscribeMediaQuery('(min-width: 1px)', () => {});
  assert.equal(typeof unsubscribe, 'function');
  assert.doesNotThrow(unsubscribe);
});

test('clipboard writes resolve false during server rendering', async () => {
  assert.equal(await writeToClipboard('text'), false);
});

const key = (init) => ({ key: '', code: '', metaKey: false, ctrlKey: false, altKey: false, shiftKey: false, ...init });

test('hotkeys parse modifiers and aliases, and mod follows the platform', () => {
  assert.deepEqual(parseHotkey('mod+shift+P'), { key: 'p', mod: true, ctrl: false, meta: false, alt: false, shift: true });
  assert.equal(parseHotkey('esc').key, 'escape');
  assert.equal(parseHotkey('mod++').key, '+');
  assert.ok(parseHotkey('mod++').mod);
  assert.ok(matchHotkey(key({ key: 'k', metaKey: true }), 'mod+k', { apple: true }));
  assert.ok(!matchHotkey(key({ key: 'k', ctrlKey: true }), 'mod+k', { apple: true }));
  assert.ok(matchHotkey(key({ key: 'k', ctrlKey: true }), 'mod+k', { apple: false }));
  assert.ok(!matchHotkey(key({ key: 'k', ctrlKey: true, shiftKey: true }), 'mod+k', { apple: false }), 'extra Shift does not match');
  assert.ok(matchHotkey(key({ key: '?', shiftKey: true }), '?', { apple: false }), 'symbols imply Shift');
  assert.ok(matchHotkey(key({ key: '˚', code: 'KeyK', altKey: true }), 'alt+k', { apple: true }), 'Option combos match by code');
  assert.ok(matchHotkey(key({ key: 'Escape' }), 'escape'));
  assert.ok(!matchHotkey(key({ key: 'j', ctrlKey: true }), 'j', { apple: false }));
});

test('hotkeys describe themselves for aria-keyshortcuts and Kbd', () => {
  assert.equal(toAriaKeyShortcuts('mod+k'), 'Meta+K Control+K');
  assert.equal(toAriaKeyShortcuts([ 'shift+?', 'escape' ]), 'Shift+? Escape');
  assert.equal(toAriaKeyShortcuts('ctrl+alt+arrowup'), 'Control+Alt+ArrowUp');
  assert.equal(toKbdKeys('mod+shift+p', { apple: true }), 'command,shift,p');
  assert.equal(toKbdKeys('mod+shift+p', { apple: false }), 'ctrl,shift,p');
  assert.equal(toKbdKeys('alt+up', { apple: true }), 'option,up');
});

test('outside presses ignore every ref and detached targets', () => {
  const inside = { id: 'inside' };
  const node = { contains: (target) => target === inside };
  assert.equal(isOutside([ { current: node } ], inside), false);
  assert.equal(isOutside([ { current: node } ], { isConnected: true }), true);
  assert.equal(isOutside([ { current: null }, { current: node } ], inside), false);
  assert.equal(isOutside([ { current: node } ], { isConnected: false }), false, 'removed mid-click');
  assert.equal(isOutside([ { current: node } ], null), false);
});

test('scroll locks nest and the last release restores the page', () => {
  const body = { style: { overflow: 'auto', paddingRight: '' } };
  globalThis.document = { body, documentElement: { clientWidth: 985 } };
  globalThis.window = { innerWidth: 1000 };
  globalThis.getComputedStyle = () => ({ paddingRight: '0px' });
  try {
    const releaseA = lockScroll();
    assert.equal(body.style.overflow, 'hidden');
    assert.equal(body.style.paddingRight, '15px', 'compensates for the scrollbar');
    const releaseB = lockScroll();
    releaseA();
    releaseA();
    assert.equal(body.style.overflow, 'hidden', 'still locked by the second caller');
    releaseB();
    assert.equal(body.style.overflow, 'auto');
    assert.equal(body.style.paddingRight, '');
  } finally {
    delete globalThis.document;
    delete globalThis.window;
    delete globalThis.getComputedStyle;
  }
});

// MARK: Layout and state

test('the collapsible sections model keeps state identity when nothing changes', () => {
  const sections = [ 'a', 'b', 'c' ];
  const state = createCollapsibleSectionsState(sections, [ 'a' ]);
  assert.deepEqual([ ...state.expanded ], [ 'a' ]);
  assert.deepEqual([ ...createCollapsibleSectionsState(sections, [], true).expanded ], sections);
  assert.equal(collapsibleSectionsReducer(state, { type: 'EXPAND', section: 'a' }), state);
  assert.equal(collapsibleSectionsReducer(state, { type: 'COLLAPSE', section: 'b' }), state);
  assert.equal(collapsibleSectionsReducer(state, { type: 'SET_EXPANDED', sections: [ 'a' ] }), state);
  const toggled = collapsibleSectionsReducer(state, { type: 'TOGGLE', section: 'b' });
  assert.deepEqual([ ...toggled.expanded ].sort(), [ 'a', 'b' ]);
  const all = collapsibleSectionsReducer(toggled, { type: 'EXPAND_ALL', sections });
  assert.ok(areAllSectionsExpanded(sections, all.expanded));
  const none = collapsibleSectionsReducer(all, { type: 'COLLAPSE_ALL' });
  assert.equal(none.expanded.size, 0);
  assert.equal(collapsibleSectionsReducer(none, { type: 'COLLAPSE_ALL' }), none);
  assert.equal(collapsibleSectionsReducer(none, { type: 'UNKNOWN' }), none);
});

test('the debouncer runs once with the latest arguments, and supports flush and cancel', (t) => {
  t.mock.timers.enable({ apis: [ 'setTimeout' ] });
  const calls = [];
  const debouncer = createDebouncer((...args) => calls.push(args), 300);
  debouncer.schedule('a');
  t.mock.timers.tick(200);
  debouncer.schedule('b');
  t.mock.timers.tick(299);
  assert.deepEqual(calls, []);
  t.mock.timers.tick(1);
  assert.deepEqual(calls, [ [ 'b' ] ]);
  debouncer.schedule('c');
  assert.ok(debouncer.isPending());
  debouncer.flush();
  assert.deepEqual(calls, [ [ 'b' ], [ 'c' ] ]);
  debouncer.schedule('d');
  debouncer.cancel();
  t.mock.timers.tick(1000);
  assert.equal(calls.length, 2);
  assert.ok(!debouncer.isPending());
});

test('the throttler runs at once, then once more at the end of the window', (t) => {
  t.mock.timers.enable({ apis: [ 'setTimeout', 'Date' ] });
  const calls = [];
  const throttler = createThrottler((value) => calls.push(value), 200);
  throttler.schedule(1);
  throttler.schedule(2);
  throttler.schedule(3);
  assert.deepEqual(calls, [ 1 ], 'leading call');
  t.mock.timers.tick(200);
  assert.deepEqual(calls, [ 1, 3 ], 'trailing call with the latest value');
  t.mock.timers.tick(500);
  throttler.schedule(4);
  assert.deepEqual(calls, [ 1, 3, 4 ]);
  const trailingOnly = [];
  const quiet = createThrottler((value) => trailingOnly.push(value), 100, { leading: false });
  quiet.schedule('x');
  assert.deepEqual(trailingOnly, []);
  t.mock.timers.tick(100);
  assert.deepEqual(trailingOnly, [ 'x' ]);
});

test('merged refs assign object and callback refs, with React 19 cleanups', () => {
  const objectRef = { current: null };
  const seen = [];
  const merged = mergeRefs(objectRef, (node) => seen.push(node), undefined, null);
  assert.equal(merged('node'), undefined);
  assert.equal(objectRef.current, 'node');
  assert.deepEqual(seen, [ 'node' ]);
  let cleaned = false;
  const withCleanup = mergeRefs(objectRef, () => () => {
    cleaned = true;
  });
  const cleanup = withCleanup('next');
  cleanup();
  assert.ok(cleaned);
  assert.equal(objectRef.current, null, 'object refs reset when another ref returned a cleanup');
  assert.equal(assignRef(undefined, 'x'), undefined);
});

test('steps clamp into range', () => {
  assert.equal(clampStep(5, 3), 2);
  assert.equal(clampStep(-1, 3), 0);
  assert.equal(clampStep(1.7, 3), 1);
  assert.equal(clampStep(Number.NaN, 3), 0);
  assert.equal(clampStep(2, 0), 0);
});
