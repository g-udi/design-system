import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('FilterBar preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./FilterBar.jsx', import.meta.url),
    {
      query: '',
      onQueryChange: () => {},
      filters: [{ id: 'published', label: 'Published' }]
    }
  );
  assert.match(html, /type="search"/);
  assert.match(html, /aria-label="Remove Published filter"/);
});
