export default {
  "Core/Breadcrumb": {
    'accessibility': 'Breadcrumb renders a nav landmark, ordered list, real links for ancestors, and aria-current on the current page.',
    'description': 'Breadcrumb renders hierarchical page trails for navigation context.',
    'props': [['items', 'Array<{ href, label, current }>', '[]', 'Convenience API for a complete breadcrumb trail.'], ['label', 'string', 'Breadcrumb', 'Accessible name for the nav landmark.'], ['className', 'string', '-', 'Root or slot class override depending on the exported primitive.'], ['children', 'ReactNode', '-', 'Composition API for custom Breadcrumb/List/Item/Link/Page layouts.'], ['href', 'string', '-', 'Link target for ancestor pages.'], ['current', 'boolean', 'false', 'Marks the active page with aria-current.']],
    usage: "import { BreadcrumbTrail } from '@gaudi/design-system';\n\n<BreadcrumbTrail\n  items={[\n    { href: '/', label: 'Home' },\n    { href: '/blog', label: 'Blog' },\n    { current: true, label: 'Design Systems' },\n  ]}\n/>"
  }
};
