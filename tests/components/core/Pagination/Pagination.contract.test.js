import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent, renderComponent } from '../../../support/renderComponent.js';

test('PaginationBar keeps English copy by default and translates every phrase through label props', async () => {
  const url = new URL('../../../../src/components/core/Pagination/Pagination.jsx', import.meta.url);
  const english = await renderComponent(url, { currentPage: 2, totalPages: 8 });
  assert.match(english, />of</);
  assert.match(english, /aria-label="Page shortcuts: 2 of 8"/);
  const french = await renderComponent(url, { currentPage: 2, totalPages: 8, ofLabel: 'sur', shortcutsLabel: 'Accès aux pages', previousLabel: 'Précédent', nextLabel: 'Suivant' });
  assert.match(french, />sur</);
  assert.match(french, /aria-label="Accès aux pages: 2 sur 8"/);
  assert.match(french, /aria-label="Précédent"/);
  assert.match(french, /aria-label="Suivant"/);
});

test('PaginationStatus forwards its compact size through the shared Button API', async () => {
  const { PaginationStatus } = await loadComponent(new URL('../../../../src/components/core/Pagination/Pagination.jsx', import.meta.url));
  const html = renderToStaticMarkup(createElement(PaginationStatus, { size: 'sm', currentPage: 2, totalPages: 8 }));
  assert.match(html, /min-h-7/);
  assert.match(html, /aria-label="Page shortcuts: 2 of 8"/);
});

test('POSTS_PER_PAGE lives outside the client module so server components read a number', async () => {
  const { readFileSync } = await import('node:fs');
  const source = readFileSync(new URL('../../../../src/components/core/Pagination/constants.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /['"]use client['"]/);
  const { POSTS_PER_PAGE } = await import('../../../../src/components/core/Pagination/constants.js');
  assert.equal(POSTS_PER_PAGE, 7);
  assert.match(readFileSync(new URL('../../../../src/components/core/Pagination/index.js', import.meta.url), 'utf8'), /POSTS_PER_PAGE \} from '\.\/constants\.js'/);
});

test('PaginationBar builds page links from serialisable string props', async () => {
  const url = new URL('../../../../src/components/core/Pagination/Pagination.jsx', import.meta.url);
  const html = await renderComponent(url, { currentPage: 2, totalPages: 3, hrefTemplate: '/blog/tags/ai/page/{page}', firstPageHref: '/blog/tags/ai' });
  assert.match(html, /href="\/blog\/tags\/ai"/);
  assert.match(html, /href="\/blog\/tags\/ai\/page\/3"/);
});
