import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { default: Card, CardRoot, CardHeader, CardTitle, CardContent, CardFooter } = await loadComponent(new URL('../../../../src/components/core/Card/index.js', import.meta.url));

test('convenience cards use the shared surface, preserve zero content, and forward host attributes', () => {
  const html = renderToStaticMarkup(h(Card, { title: 0, subtitle: 0, titleLevel: 2, id: 'summary', 'aria-label': 'Summary', padding: 'none', variant: 'outline' }, 'Body'));
  assert.equal((html.match(/data-slot="card"/g) || []).length, 1);
  assert.match(html, /data-padding="none"/);
  assert.match(html, /id="summary"/);
  assert.match(html, /aria-label="Summary"/);
  assert.match(html, /<h2[^>]*>0<\/h2>/);
  assert.match(html, /<p[^>]*>0<\/p>/);
  assert.match(html, /\bh-full w-full\b/);
  assert.match(html, /\bp-0\b/);
  assert.doesNotMatch(html, / (?:fill|variant|padding|titleLevel)=/);
});

test('compound cards retain section spacing and independent header, body, and footer semantics', () => {
  const html = renderToStaticMarkup(h(CardRoot, { size: 'sm', className: 'custom-card' },
    h(CardHeader, null, h(CardTitle, { as: 'h3' }, 'Account')),
    h(CardContent, null, 'Details'),
    h(CardFooter, null, 'Actions')
  ));
  assert.match(html, /data-padding="sections"/);
  assert.match(html, /data-size="sm"/);
  assert.match(html, /\bflex flex-col\b/);
  assert.match(html, /custom-card/);
  assert.doesNotMatch(html, /\bh-full\b|\bp-3\b/);
  for (const slot of ['card', 'card-header', 'card-title', 'card-content', 'card-footer']) {
    assert.equal((html.match(new RegExp(`data-slot="${slot}"`, 'g')) || []).length, 1, slot);
  }
});
