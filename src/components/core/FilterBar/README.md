# FilterBar

Search, supplied filter controls, removable active filters and action slots in a wrapping toolbar. Query matching and URL persistence remain with the application.

## Usage

```jsx
<FilterBar
  query={query}
  onQueryChange={setQuery}
  filters={filters}
  onRemoveFilter={removeFilter}
  onClearFilters={clearFilters}
>
  <Select aria-label='Status' options={statuses} />
</FilterBar>
```

## API

| Prop / export                     | Type              | Contract                                               |
| --------------------------------- | ----------------- | ------------------------------------------------------ |
| `query / onQueryChange`           | string / function | Controlled search; host owns matching and persistence. |
| `children / actions`              | ReactNode         | Filter controls and optional toolbar actions.          |
| `filters`                         | {id, label}[]     | Applied-filter chips with stable identifiers.          |
| `onRemoveFilter / onClearFilters` | functions         | Host actions for removing filters.                     |
| `searchLabel / placeholder`       | string            | Accessible search name and placeholder.                |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
