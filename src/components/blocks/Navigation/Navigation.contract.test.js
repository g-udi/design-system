import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { loadComponent } from '../../../test-support/renderComponent.js';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('Blocks/Navigation publishes the site header and its search entry only', async () => {
  const index = await read('./index.js');
  assert.match(index, /default as Menu/);
  assert.match(index, /default as MenuSearch/);
  assert.doesNotMatch(index, /MenuMobile|BrandMark|MenuLogo/, 'The phone sheet and brand mark stay private');
  const blocks = await read('../index.js');
  assert.match(blocks, /export \{ Menu, MenuSearch \} from '\.\/Navigation';/);
});

test('the site header composes core NavigationMenu with a two-block Blog panel and a logo slot', async () => {
  const source = await read('./Menu.jsx');
  assert.match(source, /from '\.\.\/\.\.\/core\/NavigationMenu'/);
  assert.match(source, /<NavigationMenuDropdown label='Blog'[^>]*aside=\{ <RecentPosts/);
  assert.match(source, /<NavigationMenuAside title='Recent posts' action=\{\{ 'href': '\/blog', 'label': 'See all' \}\}>/);
  assert.match(source, /\{logo \?\? <BrandMark \/>\}/);
  assert.doesNotMatch(source, /from '@\//);
});

test('MenuSearch renders a named launcher button with the keyboard hint', async () => {
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { createElement } = await import('react');
  const { default: MenuSearch } = await loadComponent(new URL('./parts/MenuSearch.jsx', import.meta.url));
  const html = renderToStaticMarkup(createElement(MenuSearch, { setOpen: () => {} }));
  assert.match(html, /<button[^>]*aria-label="Open search"/);
  assert.match(html, />Search</);
});
