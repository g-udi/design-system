# Breadcrumb

A trail of links from the site root to the current page. Use it on nested pages (docs, categories, settings) so readers can see where they are and step back up a level.

```jsx
import { BreadcrumbTrail } from '@gaudi/design-system';

<BreadcrumbTrail
  items={[
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { label: 'Design systems' }
  ]}
/>
```

`BreadcrumbTrail` (the default export) renders a labelled `nav`, an ordered list, router-aware links for ancestors and `aria-current="page"` on the last item (or the item marked `current`). `label` names the landmark.

For icons, collapsed paths or menus in the trail, compose the parts: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator` and `BreadcrumbEllipsis`. The convenience names are the same parts with a labelled landmark and Gaudi `Link` for internal routes; `BreadcrumbLinkPrimitive` and friends are the raw parts (`asChild` on the link accepts a router link).
