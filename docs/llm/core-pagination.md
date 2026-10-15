# Pagination

> Core/Pagination · core · `@gaudi/design-system/core/Pagination`

Pagination renders blog-style previous/status/next navigation. Hovering or focusing the center status reveals direct page shortcuts.

## Import

```js
import Pagination from '@gaudi/design-system/core/Pagination';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `POSTS_PER_PAGE`, `Pagination`, `PaginationBar`, `PaginationContent`, `PaginationContentPrimitive`, `PaginationEllipsis`, `PaginationEllipsisPrimitive`, `PaginationItem`, `PaginationItemPrimitive`, `PaginationLink`, `PaginationLinkPrimitive`, `PaginationNext`, `PaginationNextPrimitive`, `PaginationPrevious`, `PaginationPreviousPrimitive`, `PaginationRoot`, `PaginationStatus`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `currentPage` | `number` | `1` | no | Active page number. |
| `totalPages` | `number` | `1` | no | Total page count. |
| `getHref` | `(page) => string` | `?page={page}` | no | Builds each page link URL. |
| `onPageChange` | `(page) => void` | — | no | Optional client-side page change handler for filtered lists. |
| `label` | `string` | `Pagination` | no | Accessible name for the pagination nav. |
| `previousLabel / nextLabel / ofLabel / shortcutsLabel` | `string` | `Previous / Next / of / Page shortcuts` | no | Translatable copy for the actions, the status and the shortcut list name. |
| `children` | `ReactNode` | — | no | Composition API for custom PaginationContent/Item/Link layouts. |
| `href` | `string` | `#` | no | Link destination for previous/next/link slots. |
| `disabled` | `boolean` | `false` | no | Disables previous/next or numbered controls. |
| `isActive` | `boolean` | `false` | no | Marks a page link as current. |
| `className` | `string` | — | no | Class override on each slot. |

## Usage

```jsx
import { PaginationBar } from '@gaudi/design-system';

<PaginationBar currentPage={1} totalPages={4} getHref={(page) => `?page=${page}`} />
```

## Accessibility

Pagination renders a nav landmark, disabled button states for unavailable directions, keyboard-focusable status shortcuts, and aria-current on active numbered links.

## Examples

- Playground (Storybook `core-pagination--playground`)
- Controlled (Storybook `core-pagination--controlled`)

Curated patterns:

- Jump to a page — registry item `@gaudi/pagination-jump-to-page` (uses `NativeSelect`, `NativeSelectOption`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `PaginationContentPrimitive`, `PaginationEllipsisPrimitive`, `PaginationItemPrimitive`, `PaginationLinkPrimitive`, `PaginationRoot`, `RegistryIcon`)
- Numbered page styles — registry item `@gaudi/pagination-numbered` (uses `CardContent`, `CardRoot`, `PaginationContentPrimitive`, `PaginationEllipsisPrimitive`, `PaginationItemPrimitive`, `PaginationLinkPrimitive`, `PaginationNextPrimitive`, `PaginationPreviousPrimitive`, `PaginationRoot`, `RegistryIcon`)
- Previous and next with page info — registry item `@gaudi/pagination-previous-next` (uses `PaginationContentPrimitive`, `PaginationItemPrimitive`, `PaginationLinkPrimitive`, `PaginationNextPrimitive`, `PaginationPreviousPrimitive`, `PaginationRoot`, `RegistryIcon`)
- Rows per page and range — registry item `@gaudi/pagination-rows-per-page` (uses `NativeSelect`, `NativeSelectOption`, `PaginationContentPrimitive`, `PaginationItemPrimitive`, `PaginationLinkPrimitive`, `PaginationRoot`, `RegistryIcon`)

## Related

`core-item`, `core-link`

## README

Moves between pages of a long list. Use `PaginationBar` under a post archive or search results; compose the parts for numbered, compact or table-footer pagers.

```jsx
import { PaginationBar } from '@gaudi/design-system';

<PaginationBar currentPage={3} totalPages={8} getHref={(page) => `/blog/page/${page}`} />
```

`PaginationBar` shows Previous, an "n of total" status and Next. Previous and Next disable at either end; clicking the status or pressing Enter or Space opens page shortcuts, with ellipses past five pages. From a server component, where functions can't cross into this client module, pass strings instead of `getHref`: `hrefTemplate='/blog/page/{page}'` and `firstPageHref='/blog'`. `POSTS_PER_PAGE` (7) is safe to import on the server. Pass `onPageChange` for client-side paging: page links become buttons and the host owns `currentPage`. `label` names the landmark; `previousLabel`, `nextLabel`, `ofLabel` and `shortcutsLabel` (also on `PaginationStatus`) translate the remaining copy, defaulting to Previous, Next, of and Page shortcuts.

The parts (`Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`) are built on `Button`: `PaginationLink` is a router-aware link with `href`, a button with `onClick`, or a disabled button with `disabled`, and `isActive` marks the current page with `aria-current="page"`.
