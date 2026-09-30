import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('RadioGroup preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./RadioGroup.jsx', import.meta.url),
    {
      label: 'Visibility',
      name: 'visibility',
      defaultValue: 'private',
      options: [
        { value: 'private', label: 'Private' },
        { value: 'public', label: 'Public', disabled: true }
      ]
    }
  );
  assert.match(html, /<fieldset/);
  assert.match(html, /<legend[^>]*>Visibility/);
  assert.match(html, /type="radio"/);
  assert.match(html, /checked=""/);
  assert.match(html, /disabled=""/);
});
