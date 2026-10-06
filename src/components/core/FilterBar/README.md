# FilterBar

The toolbar above a collection: a search with a live result count, a Filters popover with one tab per facet and option
counts, and a removable "Field: Value" chip for every applied filter. It composes the DS Input, Button, Popover, Tabs
and Badge, and only presents state: the host owns matching and persistence.

```jsx
import FilterBar from '@gaudi/design-system/core/FilterBar';

<FilterBar
  query={query}
  onQueryChange={setQuery}
  count={{ shown: visible.length, total: rows.length }}
  facets={[{ id: 'status', label: 'Status', multiple: true, options: statuses, value: status, onChange: setStatus }]}
  onClearFilters={() => setQuery('')}
  actions={<Button size='sm'>New article</Button>}
/>
```

- A facet is `{ id, label, options: [{ value, label, count?, keywords?, disabled? }], value, onChange, multiple?, disabled? }`.
  Facets with more than six options get a search field.
- Long option labels truncate to the popover width and keep the full text as a tooltip.
- Below the small breakpoint the facet rail becomes a one-line facet select (`labels.facet` names it, falling back to
  `filterLabel`) above a scrollable option list, so phones keep the height for options.
- `filters` with `onRemoveFilter` shows host-applied filters as chips when you do not use facets; `onClearFilters` clears everything.
- `children` adds controls beside the search; `labels` translates every visible and accessible string.
- Phrases with a name are label functions, so translations control word order: `labels.removeFilter(value, field)` (default "Remove {value} filter"), `labels.findIn(facet)` (default "Find {facet}") and `labels.findPlaceholder(facet)`. The older string labels (`remove`, `find`) still work.
- `dir` sets the bar's reading direction (and its search field's); `inputProps` passes other attributes (name, autoComplete, id…) to the search input.
- Use the `Filters` and `FiltersAdvanced` parts for rule builders with operators, groups and drag and drop.
