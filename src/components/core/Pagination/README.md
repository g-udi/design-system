# Pagination

Moves between pages of a long list. Use `PaginationBar` under a post archive or search results; compose the parts for numbered, compact or table-footer pagers.

```jsx
import { PaginationBar } from '@gaudi/design-system';

<PaginationBar currentPage={3} totalPages={8} getHref={(page) => `/blog/page/${page}`} />
```

`PaginationBar` shows Previous, an "n of total" status and Next. Previous and Next disable at either end; clicking the status or pressing Enter or Space opens page shortcuts, with ellipses past five pages. From a server component, where functions can't cross into this client module, pass strings instead of `getHref`: `hrefTemplate='/blog/page/{page}'` and `firstPageHref='/blog'`. `POSTS_PER_PAGE` (7) is safe to import on the server. Pass `onPageChange` for client-side paging: page links become buttons and the host owns `currentPage`. `label` names the landmark; `previousLabel`, `nextLabel`, `ofLabel` and `shortcutsLabel` (also on `PaginationStatus`) translate the remaining copy, defaulting to Previous, Next, of and Page shortcuts.

The parts (`Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`) are built on `Button`: `PaginationLink` is a router-aware link with `href`, a button with `onClick`, or a disabled button with `disabled`, and `isActive` marks the current page with `aria-current="page"`.
