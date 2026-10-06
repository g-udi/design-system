import assert from 'node:assert/strict';
import test from 'node:test';
import { bracketError, bracketWindow } from '../../../../src/components/charts/TournamentBracket/bracketModel.js';

const rounds = [
  { id: 'semi', matches: [{ id: 's1' }, { id: 's2' }] },
  { id: 'final', matches: [{ id: 'f1' }] }
];
test('brackets reject broken feeder counts and ambiguous match identity', () => {
  assert.equal(bracketError(rounds), false);
  assert.equal(bracketError([]), false);
  assert.equal(bracketError(null), true);
  assert.equal(bracketError([{ id: 'final', matches: [] }]), true);
  assert.equal(bracketError([rounds[0]]), true);
  assert.equal(bracketError([rounds[0], { id: 'final', matches: [{ id: 's1' }] }]), true);
  assert.equal(bracketError([rounds[0], { id: 'semi', matches: [{ id: 'f1' }] }]), true);
});
test('round windows fit their containers and clamp stale or invalid navigation', () => {
  assert.deepEqual(bracketWindow(5, 559, 9), { start: 4, end: 5, last: 4 });
  assert.deepEqual(bracketWindow(5, 560, 9), { start: 3, end: 5, last: 3 });
  assert.deepEqual(bracketWindow(5, 879, 0), { start: 0, end: 2, last: 3 });
  assert.deepEqual(bracketWindow(5, 880, 0), { start: 0, end: 3, last: 3 });
  assert.deepEqual(bracketWindow(1, 1200, 2), { start: 0, end: 1, last: 0 });
  assert.equal(bracketWindow(3, 320, -4).start, 0);
  assert.equal(bracketWindow(3, 320, NaN).start, 0);
});
