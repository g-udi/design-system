import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('Tabs preserves its server-rendered public contract', async () => {
  const html = await renderComponent(new URL('../../../../src/components/core/Tabs/Tabs.jsx', import.meta.url), {
    defaultValue: 'overview',
    'aria-label': 'Article views',
    children: 'Views'
  });
  assert.match(html, /Article views/);
  assert.match(html, /data-orientation="horizontal"/);
});

test('Tabs draw keyboard focus inside the scrolling list and mark the selected tab in forced colours', async () => {
  const { readFile } = await import('node:fs/promises');
  const css = await readFile(new URL('../../../../src/components/core/Tabs/Tabs.css', import.meta.url), 'utf8');
  assert.match(css, /\.ds-tabs-trigger:focus-visible\s*{[^}]*outline-offset: -2px/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*\[data-state='active'\]\s*{\s*border-color: Highlight/);
});
