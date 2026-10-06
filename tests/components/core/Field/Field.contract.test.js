import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
test('FieldLabel points to the generated control identity across native control types', async () => {
  const { Field, FieldLabel, FieldInput } = await loadComponent(
    new URL('../../../../src/components/core/Field/Field.jsx', import.meta.url)
  );
  const html = renderToStaticMarkup(
    createElement(
      Field,
      null,
      createElement(FieldLabel, null, 'Summary'),
      createElement(FieldInput, { as: 'textarea', name: 'summary' })
    )
  );
  const label = html.match(/for="([^"]+)"/)[1];
  assert.ok(html.includes(`id="${label}"`));
  assert.match(html, /<textarea/);
});
