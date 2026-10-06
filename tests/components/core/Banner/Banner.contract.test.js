import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { default: Banner } = await loadComponent(new URL('../../../../src/components/core/Banner/index.js', import.meta.url));

test('linked Banner exposes its rich title and body to accessible-name computation', () => {
  const html = renderToStaticMarkup(createElement(Banner, { href: '#details', title: 'Maintenance' }, createElement('em', null, 'Search is read-only')));
  assert.match(html, /<strong[^>]*>Maintenance<\/strong>/);
  assert.match(html, /<em>Search is read-only<\/em>/);
  assert.doesNotMatch(html, /aria-label=/, 'A partial generated aria-label would hide the rich body from the accessible name');
  const override = renderToStaticMarkup(createElement(Banner, { href: '#details', title: 'Maintenance', ariaLabel: 'Read maintenance details' }, 'Search is read-only'));
  assert.match(override, /aria-label="Read maintenance details"/);
});

test('Banner preserves a zero-valued React title and body', () => {
  const html = renderToStaticMarkup(createElement(Banner, { title: 0 }, 0));
  assert.match(html, /<strong[^>]*>0<\/strong>/);
  assert.match(html, /<\/svg> 0/);
});
