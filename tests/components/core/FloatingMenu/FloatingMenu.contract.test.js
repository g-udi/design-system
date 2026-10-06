import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/core/FloatingMenu/index.js', import.meta.url));
const links = [{ href: '/blog', title: 'Blog' }, { href: '/blog/projects', title: 'Projects' }, { href: '/about', title: 'About' }];
const render = (props) => renderToStaticMarkup(createElement(publicAPI.default, props));

test('FloatingMenu renders a labelled landmark that starts hidden but stays reachable', () => {
  const html = render({ links, currentPath: '/blog/projects' });
  assert.match(html, /<nav aria-label="Quick navigation" data-state="hidden"/);
  assert.doesNotMatch(html, /<(?:nav|div|a|button)[^>]*(?:aria-hidden|inert|tabindex="-1")/, 'The hidden pill must stay in the tab order so focus can reveal it');
  assert.equal(html.match(/<a /g)?.length, links.length);
  assert.match(html, /aria-current="page"[^>]*>Projects</);
  assert.equal(html.match(/aria-current/g)?.length, 1);
  assert.match(html, /aria-label="Back to top"/);
  assert.match(html, /motion-reduce:transition-none/);
});

test('FloatingMenu supports sticky containers, actions, a custom label and no Back to top', () => {
  const html = render({ links, position: 'sticky', label: 'Article shortcuts', backToTop: false, actions: createElement('button', { type: 'button' }, 'Subscribe') });
  assert.match(html, /class="[^"]*\bsticky\b/);
  assert.match(html, /aria-label="Article shortcuts"/);
  assert.doesNotMatch(html, /Back to top/);
  assert.match(html, />Subscribe</);
});

test('FloatingMenu reads SiteConfig navigation links when none are passed', async () => {
  const source = await readFile(new URL('../../../../src/components/core/FloatingMenu/FloatingMenu.jsx', import.meta.url), 'utf8');
  assert.match(source, /links \?\? navigation\?\.links/);
  // Without a provider the default config has no links, so no empty list is rendered.
  assert.doesNotMatch(render({}), /<ul/);
});
