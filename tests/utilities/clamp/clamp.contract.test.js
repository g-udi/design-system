import assert from 'node:assert/strict';
import test from 'node:test';
import { clamp } from '../../../src/utilities/clamp.js';

test('clamp limits a value to an inclusive range', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-3, 0, 10), 0);
  assert.equal(clamp(12, 0, 10), 10);
  assert.equal(clamp(0.5, 0.5, 0.5), 0.5);
});

test('clamp leaves non-numbers to the caller', () => {
  assert.ok(Number.isNaN(clamp(Number.NaN, 0, 1)));
});
