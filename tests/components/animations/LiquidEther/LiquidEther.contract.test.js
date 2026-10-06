import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

test('LiquidEther preserves semantic content and deterministic server output', async () => {
  const { LiquidEther } = await loadComponent(new URL('../../../../src/components/animations/LiquidEther/index.js', import.meta.url));
  const render = () => renderToStaticMarkup(createElement(LiquidEther, { paused: true, height: 280, 'data-consumer': 'kept' }, createElement('p', null, 'Readable <content>')));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /Readable &lt;content&gt;/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /data-slot="liquid-ether"/);
  assert.match(html, /data-animated="false"/);
  assert.match(html, /<canvas[^>]*aria-hidden="true"/);
  assert.doesNotMatch(html, /aria-live|NaN|Infinity|fragment=/);
});

import { createEtherField, advanceEtherField } from '../../../../src/components/animations/LiquidEther/liquidEtherSimulation.js';

const dyeMass = field => field.dye.reduce((total, channel) => total + channel.reduce((sum, value) => sum + value, 0), 0);
const dyeCenter = field => {
  let mass = 0, x = 0, y = 0;
  field.dye.forEach(channel => channel.forEach((value, index) => {
    mass += value; x += (index % field.width) * value; y += Math.floor(index / field.width) * value;
  }));
  return [x / mass, y / mass];
};
const fieldInput = {
  delta: 1 / 30, time: 0, pointer: [0.55, 0.6], previousPointer: [0.35, 0.45],
  pointerActive: 1, pressed: 0, width: 1080, height: 500
};

test('LiquidEther carries pointer dye forward and dissipates it after movement stops', () => {
  const field = createEtherField(64, 40, false);
  advanceEtherField(field, fieldInput);
  const injectedMass = dyeMass(field), injectedCenter = dyeCenter(field);
  assert.ok(injectedMass > 1, 'moving the pointer must deposit a visible plume');
  for (let frame = 1; frame <= 30; frame += 1) {
    advanceEtherField(field, { ...fieldInput, time: frame / 30, previousPointer: fieldInput.pointer });
  }
  const retainedMass = dyeMass(field), transportedCenter = dyeCenter(field);
  assert.ok(retainedMass > injectedMass * 0.1, 'dye persists after the injecting movement');
  assert.ok(retainedMass < injectedMass * 0.85, 'stationary input does not continuously refill the plume');
  assert.ok(Math.hypot(...transportedCenter.map((value, index) => value - injectedCenter[index])) > 0.1, 'retained momentum transports existing dye');
  for (let frame = 31; frame <= 240; frame += 1) {
    advanceEtherField(field, { ...fieldInput, time: frame / 30, previousPointer: fieldInput.pointer });
  }
  assert.ok(dyeMass(field) < injectedMass * 0.02, 'dye clears rather than becoming a permanent central cloud');
});

test('LiquidEther has a deterministic seeded still and zero-delta redraws preserve every field', () => {
  const field = createEtherField(64, 40);
  assert.deepEqual(field.dye, createEtherField(64, 40).dye);
  assert.ok(dyeMass(field) > 1, 'reduced motion starts with representative dye');
  const before = [field.velocityX, field.velocityY, ...field.dye].map(array => [...array]);
  advanceEtherField(field, { ...fieldInput, delta: 0, pointer: [0.9, 0.1], width: 320, height: 900 });
  assert.deepEqual([field.velocityX, field.velocityY, ...field.dye].map(array => [...array]), before);
});

test('LiquidEther remains bounded under large pointer jumps and long frame gaps', () => {
  const field = createEtherField(48, 32);
  for (let frame = 0; frame < 100; frame += 1) {
    const x = frame % 2;
    advanceEtherField(field, { ...fieldInput, delta: 10, time: frame, pointer: [x, 1 - x], previousPointer: [1 - x, x], pressed: 1, width: 288 });
  }
  [field.velocityX, field.velocityY, ...field.dye].forEach(array => array.forEach(value => assert.ok(Number.isFinite(value))));
  field.dye.forEach(array => array.forEach(value => assert.ok(value >= 0 && value <= 1.31)));
});
