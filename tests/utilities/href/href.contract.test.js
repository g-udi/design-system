import assert from 'node:assert/strict';
import test from 'node:test';
import { isExternalHref, normalizeHref } from '../../../src/utilities/href.js';

test('relative documentation links keep their authored destination and stay in the current tab', () => {
  for (const href of ['?path=/docs/mdx-code--docs', './?path=/docs/mdx-callout--docs', '../guide', 'chapter.html', '#references', '/blog']) {
    assert.equal(normalizeHref(href), href);
    assert.equal(isExternalHref(href), false);
  }
});

test('relative URL support preserves protocol validation', () => {
  for (const href of ['javascript:alert(1)', 'java\nscript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'vbscript:msgbox(1)', 'file:///tmp/example', '']) {
    assert.equal(normalizeHref(href), null);
  }
  for (const href of ['https://example.com', 'http://example.com', '//example.com/path', 'mailto:reader@example.com', 'tel:+441234567890']) {
    assert.equal(normalizeHref(` ${href} `), href);
  }
  const route = { pathname: '/blog', query: { page: 2 } };
  assert.equal(normalizeHref(route), route);
});
