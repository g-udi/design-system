import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createElement } from 'react';
import { loadComponent } from '../../../support/renderComponent.js';

const url = new URL('../../../../src/components/post/OgCard/index.js', import.meta.url);
const { OgCard, default: DefaultCard, ogImageSize } = await loadComponent(url);

// Walk the element tree the way Satori does: plain host elements with inline styles only.
const elements = (node) => {
  if (!node || typeof node !== 'object') return [];
  if (typeof node.type === 'function') return elements(node.type(node.props));
  return [ node, ...[ node.props?.children ].flat(Infinity).flatMap(elements) ];
};
const card = (props) => elements(createElement(OgCard, { title: 'Notes on local-first software', ...props }));

test('OgCard is a server-safe module that needs no network, classes or client runtime', async () => {
  const source = (await readFile(new URL('../../../../src/components/post/OgCard/OgCard.jsx', import.meta.url), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(source, /['"]use client['"]|\bimport\b|className|\btw=|fetch\(|https?:\/\//);
  assert.equal(DefaultCard, OgCard);
  assert.deepEqual({ ...ogImageSize }, { width: 1200, height: 630 });
});

test('every element is a host element styled inline, and multi-child elements are flex containers', () => {
  const nodes = card({ subtitle: 'What syncing taught me.', category: 'Engineering', siteName: 'example.com', logo: createElement('svg', { width: 120, height: 120 }) });
  for (const node of nodes) {
    assert.equal(typeof node.type, 'string');
    assert.equal(node.props.className, undefined);
    const children = [ node.props.children ].flat(Infinity).filter((child) => child != null && child !== false && child !== '');
    if (node.type === 'div') assert.equal(node.props.style?.display, 'flex', `${JSON.stringify(children).slice(0, 40)} needs display:flex`);
  }
  const [ root ] = nodes;
  assert.equal(root.props.style.width, 1200);
  assert.equal(root.props.style.height, 630);
  const text = nodes.flatMap((node) => [ node.props.children ].flat()).filter((child) => typeof child === 'string');
  for (const value of [ 'Engineering', 'Notes on local-first software', 'What syncing taught me.', 'example.com' ]) assert.ok(text.includes(value), value);
  assert.ok(nodes.some((node) => node.type === 'svg'), 'the logo is rendered');
});

test('optional slots disappear, long titles step down and the palette stays neutral', () => {
  const minimal = card({});
  assert.equal(minimal.some((node) => node.type === 'svg'), false);
  const size = (title) => card({ title }).find((node) => node.props.children === title).props.style.fontSize;
  assert.ok(size('A'.repeat(120)) < size('Short title'));
  const colors = (theme) => JSON.stringify(card({ theme })[0].props.style);
  assert.notEqual(colors('dark'), colors('light'));
  for (const theme of [ 'light', 'dark' ]) {
    for (const value of colors(theme).match(/#[0-9a-f]{6}/gi)) {
      const [ r, g, b ] = value.slice(1).match(/../g).map((part) => parseInt(part, 16));
      assert.ok(r === g && g === b, `${theme} uses neutral greys only (${value})`);
    }
  }
});
