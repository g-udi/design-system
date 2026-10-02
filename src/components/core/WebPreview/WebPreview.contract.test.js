import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const { normalizeWebPreviewUrl: normalize, createWebPreviewHistory, pushWebPreviewHistory, stepWebPreviewHistory, countWebPreviewLogs } = api;

test('WebPreview publishes the ready-made preview, its parts and its pure model', () => {
  for (const name of [ 'default', 'WebPreviewRoot', 'WebPreviewNavigation', 'WebPreviewUrl', 'WebPreviewDevices', 'WebPreviewBody', 'WebPreviewConsole', 'webPreviewDevices', 'normalizeWebPreviewUrl' ]) assert.ok(api[name], name);
  assert.deepEqual(Object.keys(api.webPreviewDevices), [ 'desktop', 'tablet', 'phone' ]);
  assert.doesNotMatch(api.DEFAULT_WEB_PREVIEW_SANDBOX, /allow-same-origin/, 'framed pages must not reach the host origin by default');
});

test('the address bar accepts hosts and http(s) URLs and refuses other schemes', () => {
  assert.equal(normalize('example.com'), 'https://example.com/');
  assert.equal(normalize(' example.com:8080/docs '), 'https://example.com:8080/docs');
  assert.equal(normalize('localhost:3000'), 'http://localhost:3000/');
  assert.equal(normalize('http://a.dev/x?y=1'), 'http://a.dev/x?y=1');
  assert.equal(normalize('about:blank'), 'about:blank');
  for (const value of [ '', 'javascript:alert(1)', 'data:text/html,hi', 'file:///etc/passwd', 'not a url' ]) assert.equal(normalize(value), null, value);
});

test('history drops forward entries on a new visit and steps within bounds', () => {
  let history = createWebPreviewHistory('https://a.dev/');
  history = pushWebPreviewHistory(history, 'https://b.dev/');
  history = pushWebPreviewHistory(history, 'https://b.dev/');
  assert.equal(history.entries.length, 2, 'revisiting the current entry is a no-op');
  history = stepWebPreviewHistory(history, -1);
  assert.equal(history.index, 0);
  assert.equal(stepWebPreviewHistory(history, -1), history);
  history = pushWebPreviewHistory(history, 'https://c.dev/');
  assert.deepEqual(history.entries, [ 'https://a.dev/', 'https://c.dev/' ]);
  assert.deepEqual(countWebPreviewLogs([ { 'level': 'error' }, { 'level': 'warning' }, {} ]), { 'error': 1, 'info': 0, 'log': 1, 'total': 3, 'warn': 1 });
});

test('the preview renders a named, sandboxed frame and a blocked-site fallback on the server', () => {
  const html = renderToStaticMarkup(createElement(api.default, { 'defaultUrl': 'https://gaudi.dev', 'logs': [ { 'level': 'error', 'message': 'Boom' } ] }));
  assert.match(html, /role="toolbar"/);
  assert.match(html, /aria-label="Address"/);
  assert.match(html, /<iframe[^>]+title="Preview of https:\/\/gaudi.dev"/);
  assert.match(html, /sandbox="allow-scripts/);
  assert.match(html, /aria-label="Open in new tab"/);
  assert.match(html, /1 error/);
  const generated = renderToStaticMarkup(createElement(api.default, { 'defaultUrl': 'https://preview.local', 'srcDoc': '<h1>Hi</h1>' }));
  assert.match(generated, /srcDoc="&lt;h1&gt;Hi&lt;\/h1&gt;"/i);
  assert.doesNotMatch(generated, /Open in new tab/, 'generated pages have no real address to open');
  const blocked = renderToStaticMarkup(createElement(api.default, { 'defaultUrl': 'https://github.com/vercel/next.js', 'embeddable': false, 'previewData': { 'title': 'vercel/next.js' } }));
  assert.doesNotMatch(blocked, /<iframe/);
  assert.match(blocked, /data-slot="link-preview-card"/);
});
