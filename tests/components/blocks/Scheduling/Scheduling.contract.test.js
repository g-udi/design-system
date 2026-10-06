import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/blocks/Scheduling/index.js', import.meta.url));

test('timeSlots fits full meetings and rejects intervals that cannot advance', () => {
  assert.deepEqual(api.timeSlots({ start: '09:00', end: '10:00', step: 15, duration: 30 }), ['09:00', '09:15', '09:30']);
  for (const step of [0, -5, NaN, Infinity]) assert.deepEqual(api.timeSlots({ step }), []);
  assert.deepEqual(api.timeSlots({ duration: -15 }), []);
  assert.deepEqual(api.timeSlots({ start: '09:00', end: '10:00', step: 30, duration: 0 }), ['09:00', '09:30', '10:00']);
  assert.deepEqual(api.timeSlots({ start: 'invalid' }), []);
  assert.equal(api.addMinutes('00:15', -30), '23:45');
  assert.equal(api.addMinutes('23:45', 30), '00:15');
});
