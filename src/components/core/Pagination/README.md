# Pagination

Moves between pages of a long list. Use `PaginationBar` under a post archive or search results; compose the parts for numbered, compact or table-footer pagers.

```jsx
import { PaginationBar } from '@gaudi/design-system';

<PaginationBar currentPage={3} totalPages={8} getHref={(page) => `/blog/page/${page}`} />
```

`PaginationBar` shows Previous, an "n of total" status and Next. Previous and Next disable at either end; hovering or focusing the status reveals page shortcuts, with ellipses past five pages. Pass `onPageChange` for client-side paging: every control becomes a button and the host owns `currentPage`. `label` names the landmark.

The parts (`Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`) are built on `Button`: `PaginationLink` is a router-aware link with `href`, a button with `onClick`, or a disabled button with `disabled`, and `isActive` marks the current page with `aria-current="page"`.
