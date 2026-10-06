export default {
  "Core/Pagination": {
    'accessibility': 'Pagination renders a nav landmark, disabled button states for unavailable directions, keyboard-focusable status shortcuts, and aria-current on active numbered links.',
    'description': 'Pagination renders blog-style previous/status/next navigation. Hovering or focusing the center status reveals direct page shortcuts.',
    'props': [['currentPage', 'number', '1', 'Active page number.'], ['totalPages', 'number', '1', 'Total page count.'], ['getHref', '(page) => string', '?page={page}', 'Builds each page link URL.'], ['onPageChange', '(page) => void', '-', 'Optional client-side page change handler for filtered lists.'], ['label', 'string', 'Pagination', 'Accessible name for the pagination nav.'], ['previousLabel / nextLabel / ofLabel / shortcutsLabel', 'string', 'Previous / Next / of / Page shortcuts', 'Translatable copy for the actions, the status and the shortcut list name.'], ['children', 'ReactNode', '-', 'Composition API for custom PaginationContent/Item/Link layouts.'], ['href', 'string', '#', 'Link destination for previous/next/link slots.'], ['disabled', 'boolean', 'false', 'Disables previous/next or numbered controls.'], ['isActive', 'boolean', 'false', 'Marks a page link as current.'], ['className', 'string', '-', 'Class override on each slot.']],
    usage: "import { PaginationBar } from '@gaudi/design-system';\n\n<PaginationBar currentPage={1} totalPages={4} getHref={(page) => `?page=${page}`} />"
  }
};
