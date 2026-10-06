import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
import { canSmoothCaret } from '../../../../src/components/core/Field/hooks/inputCaretGeometry.js';

const field = (extra = {}) => ({ tagName: 'INPUT', type: 'text', value: 'Gaudi', selectionStart: 3, selectionEnd: 3, ...extra });
const style = { direction: 'ltr', writingMode: 'horizontal-tb' };

test('smooth caret is the default and provider/field overrides remain explicit', async () => {
  const { InputConfigProvider, useInputCaretMode } = await loadComponent(new URL('../../../../src/context/InputConfig.jsx', import.meta.url));
  function Mode({ override }) { return h('span', null, useInputCaretMode(override)); }
  assert.equal(renderToStaticMarkup(h(Mode)), '<span>smooth</span>');
  assert.equal(renderToStaticMarkup(h(InputConfigProvider, { caretMode: 'native' }, h(InputConfigProvider, null, h(Mode)))), '<span>native</span>');
  assert.equal(renderToStaticMarkup(h(InputConfigProvider, { caretMode: 'native' }, h(Mode, { override: 'smooth' }))), '<span>smooth</span>');
  assert.equal(renderToStaticMarkup(h(Mode, { override: 'native' })), '<span>native</span>');
});

test('smooth caret is limited to editable, collapsed selections in supported text controls', () => {
  for (const type of ['text', 'search', 'url', 'tel']) assert.equal(canSmoothCaret(field({ type }), style), true);
  assert.equal(canSmoothCaret(field({ tagName: 'TEXTAREA' }), style), true);
  for (const extra of [{ type: 'password' }, { type: 'email' }, { type: 'number' }, { type: 'date' }, { disabled: true }, { readOnly: true }, { hidden: true }, { selectionStart: null }, { selectionEnd: 4 }]) {
    assert.equal(canSmoothCaret(field(extra), style), false, JSON.stringify(extra));
  }
});

test('bidirectional and vertical text use the native caret instead of an approximate position', () => {
  assert.equal(canSmoothCaret(field(), { ...style, direction: 'rtl' }), false);
  assert.equal(canSmoothCaret(field(), { ...style, writingMode: 'vertical-rl' }), false);
  assert.equal(canSmoothCaret(field({ value: 'Hello مرحبا' }), style), false);
  assert.equal(canSmoothCaret(field({ value: 'A\u202eB' }), style), false);
  assert.equal(canSmoothCaret(field({ value: 'Résumé 日本語 🧑🏽‍💻' }), style), true);
});

test('smooth FieldInput retains native server markup without leaking configuration or decoration', async () => {
  const { FieldInput } = await loadComponent(new URL('../../../../src/components/core/Field/index.js', import.meta.url));
  const html = renderToStaticMarkup(h(FieldInput, { caretMode: 'smooth', defaultValue: 'Gaudi', name: 'title', 'aria-label': 'Title' }));
  assert.equal((html.match(/<input/g) || []).length, 1);
  assert.match(html, /name="title"/);
  assert.match(html, /value="Gaudi"/);
  assert.doesNotMatch(html, /caretMode|caretmode|input-caret|smooth-caret-active/);
});
