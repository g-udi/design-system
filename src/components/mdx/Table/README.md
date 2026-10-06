# Table

This Gaudi owner includes **table**, with shared primitives and article framing.

Import the documented composition from `@gaudi/design-system/mdx/Table`. Existing convenience names are preserved; compound roots use explicit aliases where needed.

[Open the first example](http://localhost:6007/?path=/story/mdx-table--basic) for the complete JSX and public imports. The Storybook catalogue lists every variant and use case under this owner.

Provide visible labels for controls, preserve heading order, and connect controlled values to application state. The examples exercise keyboard and accessibility behavior; application networking and persistence remain consumer responsibilities.

See [reconciliation and compatibility details](../../../../README.md#component-catalogue) and [source notices](../../../../README.md#third-party-notices).

## Shared headers and density

`TableRoot` is the unframed primitive; the default `Table` adds article scrolling, sticky columns and framing. Both accept `density='compact' | 'normal' | 'comfortable'` (default `normal`). Density changes spacing only. `TableHeadPrimitive` (or article `TableHeaderCell`) preserves label casing and uses the same 14px, medium-weight style as DataTable and DataGrid. Its `variant='muted'` default uses the muted surface; `'plain'` uses the surface colour.

Use the supplied row and cell parts, including in MDX mappings. `TableRoot` accepts `containerProps` for the scrolling wrapper, such as `role`, `tabIndex`, and `aria-label`. `TableCellPrimitive as='th' scope='row'` creates a body row header without applying column-header styling. The Header consistency story compares all four implementations and checks their computed styles and sorting.
