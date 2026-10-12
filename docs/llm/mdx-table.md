# Table

> MDX/Table · mdx · `@gaudi/design-system/mdx/Table`

Semantic article tables with contained horizontal scrolling.

## Import

```js
import Table from '@gaudi/design-system/mdx/Table';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `TableBody`, `TableBodyPrimitive`, `TableCaption`, `TableCell`, `TableCellPrimitive`, `TableFooter`, `TableHead`, `TableHeadPrimitive`, `TableHeader`, `TableHeaderCell`, `TableRoot`, `TableRow`, `TableRowPrimitive`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |
| `density` | `compact \| normal \| comfortable` | `normal` | no | Shared table spacing; header type and supplied casing stay unchanged. |
| `TableHeaderCell.variant` | `muted \| plain` | `muted` | no | Shared header fill, including opaque sticky cells. |
| `Native table props` | `TableHTMLAttributes<HTMLTableElement>` | — | no | Additional table attributes; row and cell parts forward their native attributes. |

## Variants

- `density`: `compact`, `normal`, `comfortable`

## Usage

```jsx
| Component | Status |
| --- | --- |
| Callout | Documented |
| Chart | Ready for article embeds |
```

## Accessibility

Include column or row headers and an accessible caption. Wide data scrolls inside the table region.

## Examples

- Playground (Storybook `mdx-table--playground`)
- Header Consistency (Storybook `mdx-table--header-consistency`)

Curated patterns:

- API keys and permissions — registry item `@gaudi/table-api-keys` (uses `Badge`, `Button`, `CardContent`, `CardRoot`, `RegistryIcon`, `TableBodyPrimitive`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`, `useCopyToClipboard`)
- Simple data table — registry item `@gaudi/table-basic` (uses `TableBodyPrimitive`, `TableCaption`, `TableCellPrimitive`, `TableFooter`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`)
- Editable cells — registry item `@gaudi/table-editable` (uses `CardContent`, `CardRoot`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `TableBodyPrimitive`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`)
- Leaderboard — registry item `@gaudi/table-leaderboard` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `RegistryIcon`, `TableBodyPrimitive`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`)
- Records with avatars, status and actions — registry item `@gaudi/table-records` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `RegistryIcon`, `TableBodyPrimitive`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`)
- Projects with team avatars — registry item `@gaudi/table-team-projects` (uses `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`, `AvatarRoot`, `Badge`, `RegistryIcon`, `TableBodyPrimitive`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`)
- Vertical details — registry item `@gaudi/table-vertical-details` (uses `Badge`, `Frame`, `FrameDescription`, `FrameHeader`, `FramePanel`, `FrameTitle`, `Pill`, `ProgressRoot`, `TableBodyPrimitive`, `TableCellPrimitive`, `TableRoot`, `TableRowPrimitive`)

## README

This Gaudi owner includes **table**, with shared primitives and article framing.

Import the documented composition from `@gaudi/design-system/mdx/Table`. Existing convenience names are preserved; compound roots use explicit aliases where needed.

[Open the first example](http://localhost:6007/?path=/story/mdx-table--basic) for the complete JSX and public imports. The Storybook catalogue lists every variant and use case under this owner.

Provide visible labels for controls, preserve heading order, and connect controlled values to application state. The examples exercise keyboard and accessibility behavior; application networking and persistence remain consumer responsibilities.

See [reconciliation and compatibility details](../../../../README.md#component-catalogue) and [source notices](../../../../README.md#third-party-notices).

### Shared headers and density

`TableRoot` is the unframed primitive; the default `Table` adds article scrolling, sticky columns and framing. Both accept `density='compact' | 'normal' | 'comfortable'` (default `normal`). Density changes spacing only. `TableHeadPrimitive` (or article `TableHeaderCell`) preserves label casing and uses the same 14px, medium-weight style as DataTable and DataGrid. Its `variant='muted'` default uses the muted surface; `'plain'` uses the surface colour.

Use the supplied row and cell parts, including in MDX mappings. `TableRoot` accepts `containerProps` for the scrolling wrapper, such as `role`, `tabIndex`, and `aria-label`. `TableCellPrimitive as='th' scope='row'` creates a body row header without applying column-header styling. The Header consistency story compares all four implementations and checks their computed styles and sorting.
