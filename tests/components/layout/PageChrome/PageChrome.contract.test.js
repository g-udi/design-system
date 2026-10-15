import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { loadComponent, renderComponent } from '../../../support/renderComponent.js';

const url = new URL('../../../../src/components/layout/PageChrome/index.js', import.meta.url);

test('PageChrome renders nothing while every part stays on', async () => {
  assert.equal(await renderComponent(url, {}), '');
  assert.equal(await renderComponent(url, { background: true, scrollEdges: true }), '');
});

test('switching parts off renders one hidden, server-safe marker', async () => {
  const source = await readFile(new URL('../../../../src/components/layout/PageChrome/PageChrome.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /['"]use client['"]|from 'react'/, 'The marker must render in server components without client JavaScript');
  assert.equal(await renderComponent(url, { background: false }), '<span hidden="" aria-hidden="true" data-slot="page-chrome" data-background="off"></span>');
  assert.equal(await renderComponent(url, { scrollEdges: false }), '<span hidden="" aria-hidden="true" data-slot="page-chrome" data-scroll-edges="off"></span>');
  assert.match(await renderComponent(url, { background: false, scrollEdges: false }), /data-background="off" data-scroll-edges="off"/);
});

test('the stylesheet hides only the layout-owned background and the page scroll edges, and ships in styles.css', async () => {
  const css = await readFile(new URL('../../../../src/components/layout/PageChrome/PageChrome.css', import.meta.url), 'utf8');
  assert.match(css, /\[data-slot='layout-container'\]:has\(\[data-slot='page-chrome'\]\[data-background='off'\]\) > \[data-slot='layout-background'\]/);
  assert.match(css, /\[data-slot='layout-container'\]:has\(\[data-slot='page-chrome'\]\[data-background='off'\]\) > div > \[data-slot='borealis'\]/);
  assert.match(css, /:root:has\(\[data-slot='page-chrome'\]\[data-scroll-edges='off'\]\) \[data-slot='scroll-edge'\]\[data-page\]/);
  const styles = await readFile(new URL('../../../../src/styles.css', import.meta.url), 'utf8');
  assert.match(styles, /@import '\.\/components\/layout\/PageChrome\/PageChrome\.css';/);
});

test('LayoutContainer exposes the hooks the stylesheet matches in both background modes', async () => {
  const { default: LayoutContainer } = await loadComponent(new URL('../../../../src/components/layout/LayoutContainer/LayoutContainer.js', import.meta.url));
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { createElement } = await import('react');
  const slot = await LayoutContainer({ background: createElement('div', null, 'Band'), children: 'Content' });
  assert.equal(slot.props['data-slot'], 'layout-container');
  const withSlot = slot.props.children.find?.((child) => child?.props?.children?.[0]?.props?.['data-slot'] === 'layout-background');
  assert.ok(withSlot, 'the background slot is a direct child of the layout container');
  const fallback = await LayoutContainer({ children: 'Content' });
  const borealis = [ fallback.props.children ].flat().find((child) => child?.type?.name === 'Borealis');
  assert.match(renderToStaticMarkup(createElement(borealis.type, { ...borealis.props, children: null })), /^<div[^>]*><div[^>]*data-slot="borealis"/);
});
