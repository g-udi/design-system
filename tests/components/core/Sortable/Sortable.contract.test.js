import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/core/Sortable/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/core/Sortable/stories/fixtures/sortable/sortable-row-controls.jsx', import.meta.url));

test('Sortable publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.Sortable, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});

test('the accessible position picker renders the current place and disables impossible moves', () => {
  const { Sortable, SortableItem, SortableItemPosition } = publicAPI;
  const ids = ['first', 'middle', 'last'];
  const rows = ids.map((id) => createElement(SortableItem, { key: id, value: id },
    createElement(SortableItemPosition, { 'aria-label': `Position of ${id}` })));
  const html = renderToStaticMarkup(createElement(Sortable, { value: ids, getItemValue: (id) => id }, rows));
  const selects = html.match(/<select\b.*?<\/select>/g);
  assert.equal(selects.length, ids.length);
  for (const [index, select] of selects.entries()) {
    assert.match(select, new RegExp(`aria-label="Position of ${ids[index]}"`));
    assert.match(select, new RegExp(`<option value="" selected="">${index + 1}</option>`));
    assert.equal(select.includes('value="-1" disabled'), index === 0);
    assert.equal(select.includes('value="1" disabled'), index === ids.length - 1);
  }
});

test('the checklist provides a named position picker for every strategy', async () => {
  const { PlaygroundDemo } = await loadComponent(new URL('../../../../src/components/core/Sortable/stories/fixtures/NativeExamples.jsx', import.meta.url));
  for (const strategy of ['vertical', 'horizontal', 'grid']) {
    const html = renderToStaticMarkup(createElement(PlaygroundDemo, { strategy }));
    const pickers = html.match(/<select\b[^>]*>/g) ?? [];
    assert.equal(pickers.length, 6);
    assert.ok(pickers.some((picker) => picker.includes('aria-label="Position of Research topic"')));
    assert.ok(pickers.some((picker) =>
      picker.includes('aria-label="Position of Publish"') && picker.includes('aria-disabled="true"')));
  }
});
