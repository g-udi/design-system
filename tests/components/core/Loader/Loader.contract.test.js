import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const source = new URL('../../../../src/components/core/Loader/index.js', import.meta.url);

test('all Loader variants render deterministic named statuses with decorative geometry', async () => {
  const { Loader, loaderVariants } = await loadComponent(source);
  for (const variant of loaderVariants) {
    const props = { variant, label: 'Saving draft', size: 'lg' };
    const html = renderToStaticMarkup(createElement(Loader, props));
    assert.equal(html, renderToStaticMarkup(createElement(Loader, props)));
    assert.match(html, /role="status"/);
    assert.match(html, /aria-label="Saving draft"/);
    assert.match(html, /<g aria-hidden="true">/);
    assert.ok(html.includes(`data-variant="${variant}"`));
    assert.match(html, /ds-loader-size-lg/);
    assert.doesNotMatch(html, /NaN|undefined/);
  }
  const fallback = renderToStaticMarkup(createElement(Loader, { variant: 'unknown' }));
  assert.match(fallback, /data-variant="arc"/);
});

test('Loader preserves composition attributes and opt-out semantics', async () => {
  const { Loader, LoaderRoot } = await loadComponent(source);
  const composed = renderToStaticMarkup(createElement(LoaderRoot, { role: undefined, 'aria-label': undefined, 'aria-hidden': true, className: 'size-3 text-current', 'data-icon': 'inline-start' }));
  assert.doesNotMatch(composed, /role="status"|aria-label=/);
  assert.match(composed, /aria-hidden="true"/);
  assert.match(composed, /data-icon="inline-start"/);
  assert.match(composed, /size-3 text-current/);
  assert.match(renderToStaticMarkup(createElement(Loader, {})), /ds-loader-size-md/);
  assert.match(renderToStaticMarkup(createElement(LoaderRoot, {})), /ds-loader-size-sm/);
});
