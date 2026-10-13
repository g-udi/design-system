import assert from 'node:assert/strict';
import test from 'node:test';
import { endedRecently, POINTER_DRAG_ACTIVATION, snapToPixel } from '../../../../src/components/core/shared/pointerDrag.js';
import { splitOptions, warnOnce } from '../../../../src/components/core/shared/schedulerOptions.js';

test('scheduler roots split props into options, view config over defaults, and DOM props', () => {
  const { options, viewConfig, rest } = splitOptions(
    { events: [], stickyNav: undefined, navButtonSize: 'md', id: 'plan' },
    ['events'],
    ['stickyNav', 'navButtonSize'],
    { stickyNav: true, navButtonSize: 'sm' }
  );
  assert.deepEqual(options, { events: [] });
  assert.deepEqual(viewConfig, { stickyNav: true, navButtonSize: 'md' }, 'undefined keeps the default');
  assert.deepEqual(rest, { id: 'plan' });
});

test('warnOnce warns once per scope and key, prefixed with the scope', (t) => {
  const warn = t.mock.method(console, 'warn', () => {});
  warnOnce('gantt', 'shared-key', 'first');
  warnOnce('gantt', 'shared-key', 'again');
  warnOnce('event-calendar', 'shared-key', 'other owner');
  assert.deepEqual(warn.mock.calls.map((call) => call.arguments[0]), ['[gantt] first', '[event-calendar] other owner']);
});

test('pointer drag helpers share thresholds, the trailing-click window, and pixel snapping', () => {
  assert.deepEqual(POINTER_DRAG_ACTIVATION, { moveDistancePx: 5, touchDelayMs: 250, touchTolerancePx: 5 });
  assert.equal(endedRecently(performance.now()), true);
  assert.equal(endedRecently(performance.now() - 1000), false);
  assert.equal(snapToPixel(10.4), 10, 'without a window the device pixel ratio is 1');
});
