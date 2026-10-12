# NavigationMenu

> Core/NavigationMenu · core · `@gaudi/design-system/core/NavigationMenu`

NavigationMenu renders grouped site navigation with dropdown panels for categories, sections, and related destinations.

## Import

```js
import NavigationMenu from '@gaudi/design-system/core/NavigationMenu';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `NavigationMenu`, `NavigationMenuAside`, `NavigationMenuContent`, `NavigationMenuDropdown`, `NavigationMenuIndicator`, `NavigationMenuItem`, `NavigationMenuItemPrimitive`, `NavigationMenuLink`, `NavigationMenuLinkPrimitive`, `NavigationMenuList`, `NavigationMenuListPrimitive`, `NavigationMenuPanel`, `NavigationMenuRoot`, `NavigationMenuTrigger`, `NavigationMenuViewport`, `default`, `navigationMenuTriggerStyle`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `Main navigation` | no | Accessible name for the nav landmark. |
| `children` | `ReactNode` | — | no | Composition API for list, items, links, and dropdowns. |
| `href` | `string` | — | no | NavigationMenuLink destination. |
| `active` | `boolean` | `false` | no | Marks a NavigationMenuLink as the current page with aria-current. |
| `variant` | `link \| panel` | `link` | no | Use link for top-level items and panel for dropdown card links. |
| `description` | `ReactNode` | — | no | Supporting copy shown in panel links. |
| `meta` | `ReactNode` | — | no | Small metadata line for panel links. |
| `trigger` | `ReactNode` | `label` | no | Custom dropdown trigger content. |
| `defaultOpen` | `boolean` | `false` | no | Initial uncontrolled dropdown state. Useful for demos and persistent nav panels. |
| `align` | `start \| center \| end` | `start` | no | Controls dropdown panel alignment. |
| `width` | `sm \| md \| lg \| xl \| 2xl` | `lg` | no | Controls dropdown panel width. |
| `aside` | `ReactNode` | — | no | NavigationMenuDropdown second block: turns the panel into two columns (children, then aside), stacked below sm. |
| `NavigationMenuAside.title` | `ReactNode` | — | no | Muted second column with a title that labels its group and an optional See all link. |
| `action` | `{ href, label } \| ReactNode` | — | no | Muted second column with a title that labels its group and an optional See all link. |
| `columns` | `1 \| 2 \| 3` | `2` | no | Responsive panel grid columns. |
| `panelClassName` | `string` | — | no | Dropdown panel class override. |
| `className` | `string` | — | no | Class override on each slot. |

## Variants

- `variant`: `link`, `panel`
- `align`: `start`, `center`, `end`
- `width`: `sm`, `md`, `lg`, `xl`, `2xl`
- `columns`: `1`, `2`, `3`

## Usage

```jsx
import { NavigationMenu, NavigationMenuDropdown, NavigationMenuLink, NavigationMenuList, NavigationMenuPanel } from '@gaudi/design-system';

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuLink href='' active>Blog</NavigationMenuLink>
    <NavigationMenuDropdown label='Categories' width='xl'>
      <NavigationMenuPanel columns={2}>
        <NavigationMenuLink href='' variant='panel' description='Knowledge graphs, semantic web, and linked data.'>
          Data
        </NavigationMenuLink>
        <NavigationMenuLink href='' variant='panel' description='Implementation notes and developer tooling.'>
          Engineering
        </NavigationMenuLink>
      </NavigationMenuPanel>
    </NavigationMenuDropdown>
  </NavigationMenuList>
</NavigationMenu>
```

## Accessibility

NavigationMenu renders a nav landmark, real links, native dropdown buttons, aria-expanded triggers, Escape-to-close behavior, outside-click dismissal, and aria-current for active links.

## Examples

- Playground (Storybook `core-navigationmenu--playground`)

Curated patterns:

- Blog menu with recent posts — registry item `@gaudi/navigation-menu-blog-recent-posts` (uses `NavigationMenu`, `NavigationMenuAside`, `NavigationMenuDropdown`, `NavigationMenuLink`, `NavigationMenuList`)
- Site header menu — registry item `@gaudi/navigation-menu-site-header` (uses `Button`, `NavigationMenuContent`, `NavigationMenuItemPrimitive`, `NavigationMenuLinkPrimitive`, `NavigationMenuListPrimitive`, `NavigationMenuRoot`, `NavigationMenuTrigger`, `RegistryIcon`, `navigationMenuTriggerStyle`)

## README

A site navigation bar with plain links and dropdown panels of related destinations. Use it for a header's primary navigation; use `DropdownMenu` for actions and `Tabs` for views within one page.

```jsx
import { NavigationMenu, NavigationMenuDropdown, NavigationMenuLink, NavigationMenuList, NavigationMenuPanel } from '@gaudi/design-system';

<NavigationMenu label='Main navigation'>
  <NavigationMenuList>
    <NavigationMenuLink href='/blog' active>Blog</NavigationMenuLink>
    <NavigationMenuDropdown label='Categories' align='start' width='lg'>
      <NavigationMenuPanel columns={2}>
        <NavigationMenuLink variant='panel' href='/blog/categories/data' description='Knowledge graphs and retrieval'>Data</NavigationMenuLink>
      </NavigationMenuPanel>
    </NavigationMenuDropdown>
  </NavigationMenuList>
</NavigationMenu>
```

Dropdowns open on click, close on Escape (focus returns to the trigger) or an outside click, and only one is open at a time. `align` and `width` place and size a panel, which is nudged back inside the viewport near an edge; `defaultOpen` starts one open. `active` marks the current page with `aria-current="page"`. Links close the open panel when followed.

The convenience components are built on the composition parts (`NavigationMenuRoot`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLinkPrimitive`, `NavigationMenuViewport`, `NavigationMenuIndicator`), which add hover-to-open and a shared animated viewport for custom menus.

For a two-block panel, pass `aside` to `NavigationMenuDropdown`: the children fill the first column and the aside the second (stacked below `sm`, `width='2xl'` gives both room). `NavigationMenuAside` is the usual second block, a muted column with a small title, an optional `action` (`{ href, label }` renders a "See all →" link) and its own links, labelled by its title for assistive technology.

```jsx
<NavigationMenuDropdown
  label='Blog'
  align='center'
  width='2xl'
  aside={
    <NavigationMenuAside title='Recent posts' action={{ href: '/blog', label: 'See all' }}>
      <ul>{posts.map((post) => <li key={post.slug}><NavigationMenuLink variant='panel' href={`/blog/${post.slug}`} description={post.date}>{post.title}</NavigationMenuLink></li>)}</ul>
    </NavigationMenuAside>
  }
>
  <ul>{categories.map((category) => <li key={category.id}><NavigationMenuLink variant='panel' href={category.href} description={category.description}>{category.title}</NavigationMenuLink></li>)}</ul>
</NavigationMenuDropdown>
```
