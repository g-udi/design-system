# FilterBar

> Core/FilterBar · core · `@gaudi/design-system/core/FilterBar`

A collection toolbar: search with a live result count, a Filters popover of facets with counts, and removable Field: Value chips. The host owns matching and persistence.

## Import

```js
import FilterBar from '@gaudi/design-system/core/FilterBar';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `DEFAULT_FILTER_EDITORS`, `DEFAULT_FILTER_LABELS`, `DEFAULT_FILTER_OPERATORS`, `DEFAULT_FILTER_OPERATOR_LABELS`, `DEFAULT_FILTER_VALUE_TYPE`, `FILTER_DATE_FORMAT`, `FILTER_DND_ACTIVATION`, `FILTER_DROP_ZONE_SELECTOR`, `FILTER_FIELD_PICKER_CLASS`, `FILTER_GROUP_SELECTOR`, `FILTER_MENU_CLASS`, `FILTER_MENU_LABEL_CLASS`, `FILTER_ROOT_KEY`, `FILTER_ROW_SEAM_PX`, `FILTER_ROW_SELECTOR`, `FilterActionsContext`, `FilterAdvancedRow`, `FilterBooleanEditor`, `FilterChip`, `FilterFieldPicker`, `FilterFocusContext`, `FilterMenu`, `FilterMoveToMenuItems`, `FilterMultiSelectEditor`, `FilterNumberEditor`, `FilterOperatorPopover`, `FilterRangeEditor`, `FilterRenderContext`, `FilterReorderProvider`, `FilterRowStateProvider`, `FilterRuleMenuItems`, `FilterSelectEditor`, `FilterStateContext`, `FilterTextEditor`, `FilterValuePopover`, `Filters`, `FiltersAdvanced`, `FiltersAdvancedPanel`, `FiltersBuilder`, `FiltersRow`, `RELATIVE_NEXT_WEEK`, `RELATIVE_TODAY`, `RELATIVE_TOMORROW`, `RELATIVE_YESTERDAY`, `applyFilterExclusiveSelection`, `applyFilterRelative`, `buildFilterIndex`, `cancelActiveFilterDrags`, `clearFilterQuery`, `coerceFilterValue`, `collapseFilterPath`, `collectFilterIssues`, `computeFilterSchemaSignature`, `copyFilterNodeTo`, `countFilterRules`, `createFilterDraft`, `createFilterFocusStore`, `createFilterGroup`, `createFilterIdFactory`, `createFilterOperators`, `createFilterQuery`, `createFilterResolutionStore`, `createFilterRowStateStore`, `createFilterRule`, `default`, `duplicateFilterNode`, `filterCombinatorSlot`, `filterControlSizes`, `filterDraftReducer`, `filterFilterLevel`, `filterFilterOptions`, `filterIssueLabel`, `filterReadOnlyProps`, `findFilterNode`, `findFilterRule`, `findFilterSchemaIssues`, `flattenFilterConditions`, `flattenFilterRules`, `foldFilterText`, `formatFilterDate`, `formatFilterPath`, `getDefaultFilterOperator`, `getFilterArity`, `getFilterChildren`, `getFilterField`, `getFilterFieldChain`, `getFilterFieldCount`, `getFilterOperator`, `insertFilterNode`, `isFilterBranch`, `isFilterDraftCommittable`, `isFilterDropNoop`, `isFilterFieldPickable`, `isFilterFieldSelectable`, `isFilterGroup`, `isFilterLocked`, `isFilterQueryEmpty`, `isFilterRule`, `isFilterRuleComplete`, `isFilterTime`, `joinFilterPath`, `matchesFilterQuery`, `moveFilterNode`, `moveFilterNodeTo`, `negateFilterOperator`, `normalizeFilterQuery`, `operatorTakesValue`, `parentFilterKey`, `parseFilterDate`, `pruneFilterQuery`, `removeFilterNode`, `resetFilterWarnings`, `resolveFilterDate`, `resolveFilterDrop`, `resolveFilterEditor`, `resolveFilterLabels`, `resolveFilterOperators`, `searchFilterDeep`, `setFilterCombinator`, `splitFilterPath`, `stepPlaceholder`, `toCascaderNodes`, `toFilterDateValue`, `toggleFilterCombinator`, `unwrapFilterGroup`, `updateFilterRule`, `useFilterActions`, `useFilterChipAutoOpen`, `useFilterChipFocused`, `useFilterFocus`, `useFilterFocusEmpty`, `useFilterFocusStore`, `useFilterOptions`, `useFilterRender`, `useFilterReorderable`, `useFilterRowDrag`, `useFilterRowPending`, `useFilterRowStateStore`, `useFilterRuleDisplay`, `useFilterSegmentFocus`, `useFilterState`, `useFilterTouched`, `useFilterValueResolution`, `visibleFilterOperators`, `warnFilterOnce`, `wasRecentFilterDrag`, `wrapFilterNodeInGroup`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `query` | `string` | — | no | Controlled search query. |
| `onQueryChange` | `(query: string) => void` | — | no | Controlled search query. |
| `labels.removeFilter / labels.findIn / labels.findPlaceholder` | `(value, field) => string / (facet) => string` | `Remove {value} filter / Find {facet}` | no | Translatable phrases with names in them. |
| `dir` | `'ltr' \| 'rtl'` | — | no | Reading direction of the bar and its search; extra search input attributes. |
| `inputProps` | `object` | — | no | Reading direction of the bar and its search; extra search input attributes. |
| `count` | `{ shown, total }` | — | no | Live result count shown inside the search field. |
| `facets` | `Array<{ id, label, options: Array<{ value, label, count? }>, value, onChange, multiple? }>` | `[]` | no | Controlled facets listed in the Filters popover; every selected value becomes a chip. |
| `filterLabel` | `string` | `Filters` | no | Filters trigger label. |
| `searchLabel / placeholder` | `string` | `Search records / Search…` | no | Search control label and hint. |
| `filters` | `Array<{ id, label, field? }>` | `[]` | no | Other applied filters shown as chips. |
| `onRemoveFilter / onClearFilters` | `function` | — | no | Remove one filter or reset the collection. |
| `actions` | `ReactNode` | — | no | Collection actions, aligned to the end. |
| `labels` | `object` | — | no | Visible and accessible copy overrides; labels.facet names the phone facet select. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `dir`: `ltr`, `rtl`

## Usage

```jsx
import FilterBar from '@gaudi/design-system/core/FilterBar';

<FilterBar query={query} onQueryChange={setQuery} facets={facets} />
```

## Accessibility

Search has a visible or programmatic label. Each chip names its remove action; the facet popover uses tabs for categories (a labelled facet select on phones) and checkbox or radio rows for values. Truncated option labels keep their full text as a tooltip.

## Notes

- Filters is the compound query-builder export. Its examples cover nested groups, operators, asynchronous values and saved queries.

## Examples

- Playground (Storybook `core-filterbar--playground`)
- Applied Filters (Storybook `core-filterbar--applied-filters`)
- Long Options And Phones (Storybook `core-filterbar--long-options-and-phones`)

Curated patterns:

- One bar, every filter kind — registry item `@gaudi/filters-all-in-one` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Filters`, `RegistryIcon`, `cn`, `createFilterQuery`, `createFilterRule`)
- Controlled state, sizes and locales — registry item `@gaudi/filters-controlled-translated` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Badge`, `Filters`, `RegistryIcon`, `Switch`, `ToggleGroupItem`, `ToggleGroupRoot`, `cn`, `createFilterQuery`, `createFilterRule`)
- Custom value editors — registry item `@gaudi/filters-custom-editors` (uses `Button`, `Calendar`, `CheckboxRoot`, `FieldInput`, `Filters`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `InputGroupText`, `InputOTP`, `InputOTPGroup`, `InputOTPSeparator`, `InputOTPSlot`, `Label`, `NativeSelect`, `NativeSelectOption`, `RadioGroupItem`, `RadioGroupRoot`, `RegistryIcon`, `Slider`, `SwitchRoot`, `Textarea`, `ToggleGroupItem`, `ToggleGroupRoot`, `cn`, `createFilterQuery`, `createFilterRule`, `formatFilterDate`, `parseFilterDate`, `resolveFilterDate`, `toFilterDateValue`)
- Nested groups edited in place — registry item `@gaudi/filters-inline-groups` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Button`, `CardContent`, `CardRoot`, `Filters`, `RegistryIcon`, `cn`, `countFilterRules`, `createFilterGroup`, `createFilterQuery`, `createFilterRule`, `isFilterRule`)
- Deep attribute menus for large libraries — registry item `@gaudi/filters-nested-attributes` (uses `Filters`, `RegistryIcon`, `createFilterQuery`, `createFilterRule`)
- Filtering a table with nested groups — registry item `@gaudi/filters-table-groups` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `CardAction`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `DataGrid`, `DataGridColumnHeader`, `DataGridPagination`, `DataGridScrollArea`, `DataGridTable`, `DataGridTableFootRow`, `DataGridTableFootRowCell`, `Filters`, `RegistryIcon`, `cn`, `createFilterGroup`, `createFilterQuery`, `createFilterRule`, `dataGridFeatures`, `isFilterRule`)

## Related

`core-field`

## README

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
