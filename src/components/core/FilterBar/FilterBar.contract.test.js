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

test('FilterBar facet pane truncates long labels and collapses the rail on phones', async () => {
  const { readFile } = await import('node:fs/promises');
  const css = await readFile(new URL('../../../application.css', import.meta.url), 'utf8');
  const source = await readFile(new URL('./FilterBar.jsx', import.meta.url), 'utf8');
  const rule = (selector) => css.match(new RegExp(`\\${selector} \\{([^}]*)\\}`))?.[1] || '';
  // A minmax(0, 1fr) track keeps the option column at the popover width instead of the longest label.
  for (const selector of ['.ds-filter-bar', '.ds-facet-pane', '.ds-facet-options']) {
    assert.match(rule(selector), /grid-template-columns: minmax\(0, 1fr\)/, selector);
  }
  assert.match(source, /title=\{String\(option\.label\)\}/);
  // Phones swap the vertical facet rail for a one-line facet select above the option list.
  assert.match(source, /className='ds-facet-picker sm:hidden'/);
  assert.match(source, /<NativeSelect[\s\S]*aria-label=\{labels\.facet \|\| filterLabel\}/);
  assert.match(source, /max-sm:hidden/);
});
