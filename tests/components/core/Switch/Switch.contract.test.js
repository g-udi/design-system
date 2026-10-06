import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('Switch renders the composition part with a label that targets it', async () => {
  const html = await renderComponent(new URL('../../../../src/components/core/Switch/Switch.jsx', import.meta.url), {
    id: 'setting',
    label: 'Email notifications',
    defaultChecked: true
  });
  assert.match(html, /role="switch"/);
  assert.match(html, /id="setting"/);
  assert.match(html, /aria-checked="true"/);
  assert.match(html, /<label[^>]*for="setting"[^>]*>Email notifications</);
});

test('Switch animates colours only and mirrors its thumb in right-to-left text', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../../../../src/components/core/Switch/SwitchPrimitives.jsx', import.meta.url), 'utf8');
  const css = await readFile(new URL('../../../../src/components/core/Switch/Switch.css', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /transition-all/);
  assert.match(css, /\.ds-part-switch:dir\(rtl\)\s*{\s*--ds-switch-direction: -1;/);
  assert.match(css, /focus-visible:ring-ui-primary/);
});
