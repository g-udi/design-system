import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('ResourceList preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./ResourceList.jsx', import.meta.url),
    {
      label: 'Articles',
      items: [{ id: 'a', title: 'First' }],
      renderItem: (item) => item.title
    }
  );
  assert.match(html, /<ul aria-label="Articles"/);
  assert.match(html, /<li>First/);
});
