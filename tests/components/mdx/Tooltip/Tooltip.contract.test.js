import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

const source = new URL('../../../../src/components/mdx/Tooltip/Tooltip.js', import.meta.url);

test('article explanations preserve numeric zero instead of falling back to the alias', async () => {
  const markup = await renderComponent(source, { message: 0, text: 'Fallback', children: 'Count' });
  assert.match(markup, /aria-describedby="[^"]+"/);
  assert.match(markup, /hidden="">0<\/span>/);
  assert.doesNotMatch(markup, /Fallback/);
});
