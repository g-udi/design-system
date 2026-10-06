import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('FilterBar preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/core/FilterBar/FilterBar.jsx', import.meta.url),
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
  const css = await readFile(new URL('../../../../src/components/core/FilterBar/FilterBar.css', import.meta.url), 'utf8');
  const source = await readFile(new URL('../../../../src/components/core/FilterBar/FilterBar.jsx', import.meta.url), 'utf8');
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

test('FilterBar phrases chip names through label functions and passes dir and input attributes to its search', async () => {
  const url = new URL('../../../../src/components/core/FilterBar/FilterBar.jsx', import.meta.url);
  const filters = [{ id: 'status', field: 'Status', label: 'Draft' }];
  const fallback = await renderComponent(url, { filters, onRemoveFilter: () => {} });
  assert.match(fallback, /aria-label="Remove Draft filter"/);
  const html = await renderComponent(url, {
    filters,
    onRemoveFilter: () => {},
    onQueryChange: () => {},
    query: '',
    dir: 'rtl',
    inputProps: { name: 'q' },
    labels: { removeFilter: (value, field) => `Supprimer ${field} ${value}` }
  });
  assert.match(html, /aria-label="Supprimer Status Draft"/);
  assert.match(html, /<input[^>]*name="q"/);
  assert.match(html, /<input[^>]*dir="rtl"/);
});
