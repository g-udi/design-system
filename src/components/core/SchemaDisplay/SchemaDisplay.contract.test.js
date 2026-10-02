import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (props) => renderToStaticMarkup(h(api.SchemaDisplay, props));

const schema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    tags: { type: 'array', items: { type: 'string' } },
    author: { type: 'object', properties: { name: { type: 'string' } } }
  }
};

test('An endpoint reads as a method badge, a highlighted path and headed sections', () => {
  const html = render({ method: 'get', path: '/posts/{slug}/comments', parameters: [{ name: 'slug', in: 'path', type: 'string' }], responseBody: schema, headingLevel: 4 });
  assert.match(html, /data-slot="schema-display-method"[^>]*>GET</);
  assert.match(html, /<span data-param=""[^>]*>\{slug\}<\/span>/);
  assert.match(html, /<h4[^>]*>Parameters<\/h4>/);
  assert.match(html, /<h4[^>]*>Response<\/h4>/);
  // Path parameters are always required, and required is written out.
  assert.equal((html.match(/>required</g) || []).length, 2);
});

test('Schema trees show types, arrays and nested objects as disclosures', () => {
  const html = render({ title: 'Comment', schema, defaultExpandDepth: 0 });
  assert.match(html, />string\[\]</);
  assert.match(html, />uuid</);
  assert.match(html, /aria-expanded="false"/);
  assert.ok(api.SchemaDisplayProperties && api.SchemaDisplayPath && api.SchemaDisplayMethod);
});
