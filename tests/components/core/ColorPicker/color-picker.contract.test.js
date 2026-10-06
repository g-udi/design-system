import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
import { normalizeHex, normalizeColor, parseColor, rgbToHsv, hsvToRgb, rgbToHsl, hslToRgb, toHex } from '../../../../src/components/core/ColorPicker/colorPickerModel.js';

const { ColorPicker } = await loadComponent(new URL('../../../../src/components/core/ColorPicker/index.js', import.meta.url));
const render = props => renderToStaticMarkup(createElement(ColorPicker, props));

test('hex normalization handles shorthand, alpha and invalid values', () => {
  for (const value of ['#aBc', 'ABC', ' #AABBCC ', '#aabbccff']) assert.equal(normalizeHex(value), '#aabbcc');
  assert.equal(normalizeHex('#abcd'), '#aabbccdd');
  assert.equal(normalizeColor('rgba(255, 0, 128, 0.5)'), '#ff008080');
  assert.equal(normalizeColor('hsl(120, 100%, 50%)'), '#00ff00');
  assert.equal(normalizeColor('hsla(240, 100%, 50%, 25%)'), '#0000ff40');
  assert.equal(normalizeColor('rgb(100% 0% 0% / 0%)'), '#ff000000');
  assert.equal(normalizeColor('rgb(50% 50% 50%)'), '#808080');
  assert.equal(normalizeColor('rgb(50% 50% 50%)'), normalizeColor('rgb(127.5 127.5 127.5)'));
  assert.equal(normalizeColor('rgb(90% 0% 0%)'), '#e60000');
  assert.equal(normalizeColor('rgb(90% 0% 0%)'), normalizeColor('rgb(229.5 0 0)'));
  for (const value of ['', '#', '#12345', 'red', '#gggggg', 'rgb(1, 2, nope)', 'rgb(1,,2,3)', 'rgb(1 2 3 0.5)', 'rgb(1,2,3/0.5)', 'hsl(20, 50, 50)', null, 123]) assert.equal(normalizeColor(value), null);
});

test('HSV round trips primary colors, edge cases and representative colors without drift', () => {
  for (const hex of ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#808080', '#2563eb', '#010203', '#abcdef']) {
    const rgb = parseColor(hex);
    assert.equal(toHex(hsvToRgb(rgbToHsv(rgb))), hex);
    const hsl = rgbToHsl(rgb);
    const roundTrip = hslToRgb(hsl);
    for (const channel of ['r', 'g', 'b']) assert.ok(Math.abs(roundTrip[channel] - rgb[channel]) <= 3, `${hex}: HSL quantization`);
  }
  assert.equal(toHex(hsvToRgb({ h: 360, s: 1, v: 1 })), '#ff0000');
  assert.equal(toHex(hsvToRgb({ h: -120, s: 1, v: 1 })), '#0000ff');
});

test('server rendering keeps controlled color, accessible controls and form value consistent', () => {
  const html = render({ id: 'accent', label: 'Accent', value: '#ABC', defaultValue: '#000', name: 'accent', swatches: ['#abc', '#AABBCC', 'invalid', '#000'] });
  assert.match(html, /id="accent"/);
  assert.match(html, /aria-label="Accent: hex value"/);
  assert.match(html, /aria-label="Accent: hue"/);
  assert.match(html, /aria-label="Accent: saturation"/);
  assert.match(html, /aria-label="Accent: brightness"/);
  assert.match(html, /aria-label="Accent: opacity"/);
  assert.match(html, /type="hidden" name="accent" value="#aabbcc"/);
  assert.equal((html.match(/data-slot="color-picker-swatch"/g) || []).length, 2);
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
});

test('disabled, read-only and hidden alpha controls keep their documented form semantics', () => {
  assert.match(render({ name: 'color', disabled: true }), /type="hidden" disabled="" name="color" value="#2563eb"/);
  const readOnly = render({ name: 'color', readOnly: true });
  assert.match(readOnly, /readOnly=""/);
  assert.match(readOnly, /type="hidden" name="color" value="#2563eb"/);
  const withoutAlpha = render({ showAlpha: false, showEyeDropper: false, defaultValue: '#ff000080' });
  assert.doesNotMatch(withoutAlpha, /aria-label="Color: opacity|pick from screen/);
  assert.match(withoutAlpha, /value="#ff000080"/);
});
