import assert from 'node:assert/strict';
import test from 'node:test';
import { createHyperspeedMotion } from '../../../../src/components/animations/Hyperspeed/hyperspeedMotion.js';

test('Hyperspeed integrates acceleration without jumping on press, release or pause', () => {
  let travel;
  const gl = { CURRENT_PROGRAM: 0, getParameter: () => 'program', getUniformLocation: () => 'travel', uniform1f: (_location, value) => { travel = value; } };
  const motion = createHyperspeedMotion(gl);
  motion.step({ delta: 1, time: 1, pressed: 0 });
  assert.equal(travel, 12);
  motion.step({ delta: 0, time: 1, pressed: 1 });
  assert.equal(travel, 12, 'pressing does not multiply elapsed time');
  motion.step({ delta: 1, time: 2, pressed: 1 });
  assert.equal(travel, 56);
  motion.step({ delta: 0, time: 2, pressed: 0 });
  assert.equal(travel, 56, 'release and paused frames retain accumulated travel');
  motion.step({ delta: 1, time: 3, pressed: 0 });
  assert.equal(travel, 68, 'normal speed resumes from the current position');
});
