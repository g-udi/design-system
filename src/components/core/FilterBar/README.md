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
- `filters` with `onRemoveFilter` shows host-applied filters as chips when you do not use facets; `onClearFilters` clears everything.
- `children` adds controls beside the search; `labels` translates every visible and accessible string.
- Use the `Filters` and `FiltersAdvanced` parts for rule builders with operators, groups and drag and drop.
