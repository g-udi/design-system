import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { default: Footer } = await loadComponent(new URL('../../../../src/components/layout/Footer/index.js', import.meta.url));

test('Footer instances have distinct, resolved landmark labels', () => {
  const html = renderToStaticMarkup(createElement(Fragment, null,
    createElement(Footer, { variant: 'editorial' }),
    createElement(Footer, { variant: 'editorial' })
  ));
  const labels = [...html.matchAll(/<footer aria-labelledby="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(labels.length, 2);
  assert.equal(new Set(labels).size, 2);
  for (const label of labels) assert.ok(html.includes(`<h2 id="${label}"`));
});

test('Footer uses host content without personal defaults or transformed labels', () => {
  const empty = renderToStaticMarkup(createElement(Footer, { variant: 'editorial' }));
  assert.doesNotMatch(empty, /Ahmad|assaf|href=|Writing about|All rights reserved/);
  const html = renderToStaticMarkup(createElement(Footer, {
    variant: 'editorial', copyrightName: 'Example team',
    sections: [{ title: 'Resources', links: [{ href: '/ebay', label: 'eBay integrations' }] }]
  }));
  assert.match(html, /eBay integrations/);
  assert.doesNotMatch(html, /capitalize/);
  assert.match(html, /Example team/);
});
