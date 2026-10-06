import assert from 'node:assert/strict';
import test from 'node:test';
import { createBackgroundPointer } from '../../../src/components/animations/backgroundPointer.js';

test('background input retains bounded wakes and clicks, freezes, and releases smoothly', () => {
  const input = createBackgroundPointer();
  input.move([0.9, 0.8]);
  input.down(2);
  input.step(0.1, 2.1);
  assert.ok(input.pointer[0] > 0.5 && input.pointer[0] < 0.9);
  assert.ok(input.pressed > 0 && input.pressed < 1);
  assert.ok(input.trail[3] > 0);
  assert.equal(input.clicks[2], 2);
  const snapshot = [input.pointer.slice(), input.trail.slice(), input.pressed];
  input.step(0, 2.1);
  assert.deepEqual([input.pointer.slice(), input.trail.slice(), input.pressed], snapshot);
  for (let i = 0; i < 50; i++) {
    input.move([i % 2, 0.7]);
    input.down(3 + i);
    input.step(0.1, 3 + i);
  }
  assert.equal(input.trail.length, 64);
  assert.equal(input.clicks.length, 16);
  assert.equal(input.clicks[2], 52);
  assert.equal(input.clicks[14], 49);
  input.leave();
  for (let i = 0; i < 30; i++) input.step(0.1, 53 + i / 10);
  assert.ok(input.pressed < 0.001);
  assert.ok(input.pointerActive < 0.001);
  assert.ok(Math.abs(input.pointer[0] - 0.5) < 0.001);
  input.reset();
  assert.ok(input.trail.every(value => value === 0));
  assert.ok(input.clicks.every(value => value === 0));
});
