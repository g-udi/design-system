# Breadcrumb

> Core/Breadcrumb · core · `@gaudi/design-system/core/Breadcrumb`

Breadcrumb renders hierarchical page trails for navigation context.

## Import

```js
import Breadcrumb from '@gaudi/design-system/core/Breadcrumb';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Breadcrumb`, `BreadcrumbEllipsis`, `BreadcrumbEllipsisPrimitive`, `BreadcrumbItem`, `BreadcrumbItemPrimitive`, `BreadcrumbLink`, `BreadcrumbLinkPrimitive`, `BreadcrumbList`, `BreadcrumbListPrimitive`, `BreadcrumbPage`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparator`, `BreadcrumbSeparatorPrimitive`, `BreadcrumbTrail`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `Array<{ href, label, current }>` | `[]` | no | Convenience API for a complete breadcrumb trail. |
| `label` | `string` | `Breadcrumb` | no | Accessible name for the nav landmark. |
| `className` | `string` | — | no | Root or slot class override depending on the exported primitive. |
| `children` | `ReactNode` | — | no | Composition API for custom Breadcrumb/List/Item/Link/Page layouts. |
| `href` | `string` | — | no | Link target for ancestor pages. |
| `current` | `boolean` | `false` | no | Marks the active page with aria-current. |

## Usage

```jsx
import { BreadcrumbTrail } from '@gaudi/design-system';

<BreadcrumbTrail
  items={[
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { current: true, label: 'Design Systems' },
  ]}
/>
```

## Accessibility

Breadcrumb renders a nav landmark, ordered list, real links for ancestors, and aria-current on the current page.

## Examples

- Playground (Storybook `core-breadcrumb--playground`)

Curated patterns:

- Collapsed path with menu — registry item `@gaudi/breadcrumb-collapsed-path` (uses `BreadcrumbEllipsisPrimitive`, `BreadcrumbItemPrimitive`, `BreadcrumbLinkPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Button`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`)
- Contained and button styles — registry item `@gaudi/breadcrumb-contained-buttons` (uses `BreadcrumbItemPrimitive`, `BreadcrumbLinkPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Button`, `CardContent`, `CardRoot`, `Frame`, `FramePanel`, `RegistryIcon`)
- Icons, badges and avatars — registry item `@gaudi/breadcrumb-icons-avatars` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `BreadcrumbItemPrimitive`, `BreadcrumbLinkPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Button`, `RegistryIcon`)
- Separators — registry item `@gaudi/breadcrumb-separators` (uses `BreadcrumbItemPrimitive`, `BreadcrumbLinkPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `RegistryIcon`)
- Workspace, user and document — registry item `@gaudi/breadcrumb-workspace-path` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `BreadcrumbItemPrimitive`, `BreadcrumbLinkPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Frame`, `FramePanel`, `RegistryIcon`)

## Related

`core-item`, `core-link`

## README

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
