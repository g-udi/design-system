import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Tabs preserves its server-rendered public contract', async () => {
  const html = await renderComponent(new URL('./Tabs.jsx', import.meta.url), {
    defaultValue: 'overview',
    'aria-label': 'Article views',
    children: 'Views'
  });
  assert.match(html, /Article views/);
  assert.match(html, /data-orientation="horizontal"/);
});
