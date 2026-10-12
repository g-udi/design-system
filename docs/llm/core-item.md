# Item

> Core/Item · core · `@gaudi/design-system/core/Item`

Flexible rows for people, settings, integrations, navigation and activity lists, composed from media, text, actions and optional header and footer rows.

## Import

```js
import { Item } from '@gaudi/design-system/core/Item';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Item`, `ItemActions`, `ItemContent`, `ItemDescription`, `ItemFooter`, `ItemGroup`, `ItemHeader`, `ItemMedia`, `ItemSeparator`, `ItemTitle`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `default \| outline \| muted` | `default` | no | Row surface: plain, bordered or tinted. |
| `size` | `default \| sm \| xs` | `default` | no | Row density. |
| `as` | `ElementType` | `div` | no | Render the row as another element, or merge it into a link or button child. |
| `asChild` | `boolean` | `false` | no | Render the row as another element, or merge it into a link or button child. |
| `ItemMedia.variant` | `default \| icon \| image` | `default` | no | Presentation of the leading media slot. |
| `ItemGroup` | `HTMLAttributes<HTMLDivElement>` | — | no | A role="group" wrapper that stacks rows; pair with ItemSeparator. |
| `ItemTitle / ItemDescription` | `ReactNode` | — | no | Row title (one line) and supporting text (two lines). |
| `ItemActions / ItemHeader / ItemFooter` | `ReactNode` | — | no | Trailing controls and full-width rows above or below the content. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `variant`: `default`, `outline`, `muted`
- `size`: `default`, `sm`, `xs`

## Usage

```jsx
import { Button, Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@gaudi/design-system';
import { RegistryIcon } from '@gaudi/design-system/icons';

<ItemGroup>
  <Item variant='outline'>
    <ItemMedia variant='icon'><RegistryIcon lucide='GithubIcon' aria-hidden='true' /></ItemMedia>
    <ItemContent>
      <ItemTitle>GitHub</ItemTitle>
      <ItemDescription>Sync pull requests and issues.</ItemDescription>
    </ItemContent>
    <ItemActions><Button href='/settings/integrations/github' size='sm' variant='outline'>Connect</Button></ItemActions>
  </Item>
</ItemGroup>
```

## Accessibility

Use asChild with a link when the whole row navigates and keep independent actions outside that link. Name icon-only actions after their row, and label a group when the surrounding heading does not describe it.

## Examples

Curated patterns:

- Activity feed — registry item `@gaudi/item-activity-feed` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Item`, `ItemActions`, `ItemContent`, `ItemDescription`, `ItemGroup`, `ItemMedia`, `ItemTitle`)
- Changed files summary — registry item `@gaudi/item-changed-files` (uses `Badge`, `Item`, `ItemContent`, `ItemMedia`, `RegistryIcon`)
- Header and footer — registry item `@gaudi/item-header-footer` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Item`, `ItemActions`, `ItemContent`, `ItemDescription`, `ItemFooter`, `ItemHeader`, `ItemTitle`, `ProgressRoot`, `RegistryIcon`)
- Log links and a reversible action — registry item `@gaudi/item-links-action` (uses `Button`, `Item`, `ItemContent`, `ItemMedia`, `Link`, `RegistryIcon`)
- Run status with a live step — registry item `@gaudi/item-live-run` (uses `Badge`, `CardContent`, `CardDescription`, `CardHeader`, `CardRoot`, `CardTitle`, `Item`, `ItemContent`, `ItemMedia`, `LoaderRoot`, `RegistryIcon`)
- Menu with counts and shortcuts — registry item `@gaudi/item-menu-counts` (uses `Badge`, `Item`, `ItemActions`, `ItemContent`, `ItemGroup`, `ItemMedia`, `ItemSeparator`, `ItemTitle`, `KbdRoot`, `Link`, `RegistryIcon`)
- Navigation rows — registry item `@gaudi/item-navigation` (uses `Item`, `ItemActions`, `ItemContent`, `ItemDescription`, `ItemGroup`, `ItemMedia`, `ItemSeparator`, `ItemTitle`, `Link`, `RegistryIcon`)
- Run log grouped by phase — registry item `@gaudi/item-run-log` (uses `CardContent`, `CardDescription`, `CardHeader`, `CardRoot`, `CardTitle`, `Item`, `ItemContent`, `ItemMedia`, `RegistryIcon`, `Separator`)
- Settings and integrations — registry item `@gaudi/item-settings-integrations` (uses `Badge`, `Button`, `Item`, `ItemActions`, `ItemContent`, `ItemDescription`, `ItemGroup`, `ItemMedia`, `ItemTitle`, `RegistryIcon`)
- Team members and roles — registry item `@gaudi/item-team-roles` (uses `AvatarBadge`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `Item`, `ItemActions`, `ItemContent`, `ItemDescription`, `ItemGroup`, `ItemMedia`, `ItemTitle`, `Link`, `RegistryIcon`)
- Variants and sizes — registry item `@gaudi/item-variants` (uses `Item`, `ItemContent`, `ItemDescription`, `ItemMedia`, `ItemTitle`, `RegistryIcon`)

## README

A flexible row for lists of people, settings, integrations, navigation links, activity and run logs. Compose media, a title and description, trailing actions, and an optional header or footer; group rows with `ItemGroup` and divide them with `ItemSeparator`.

### Usage

```jsx
import { Button, Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle, RegistryIcon } from '@gaudi/design-system';

<ItemGroup>
  <Item variant='outline'>
    <ItemMedia variant='icon'><RegistryIcon lucide='GithubIcon' aria-hidden='true' /></ItemMedia>
    <ItemContent>
      <ItemTitle>GitHub</ItemTitle>
      <ItemDescription>Sync pull requests and issues.</ItemDescription>
    </ItemContent>
    <ItemActions><Button href='/settings/integrations/github' size='sm' variant='outline'>Connect</Button></ItemActions>
  </Item>
</ItemGroup>
```

The parts are also available from `@gaudi/design-system/core/Item`.

### Parts

| Part | Contract |
| --- | --- |
| `Item` | `variant` (default, outline, muted), `size` (default, sm, xs), `as` for the element and `asChild` to render a link or button. |
| `ItemMedia` | `variant` default, icon or image. |
| `ItemContent`, `ItemTitle`, `ItemDescription` | Main text column; the description clamps to two lines. |
| `ItemActions` | Trailing badges, buttons or menus. |
| `ItemHeader`, `ItemFooter` | Full-width rows above and below the content. |
| `ItemGroup`, `ItemSeparator` | A `role='group'` list wrapper and a horizontal divider. |

### Accessibility

Use `asChild` with a link when the whole row navigates, and keep independent actions outside that link. Name icon-only actions after their row ("Remove Odile Marchetti"). Give a group of rows an accessible name with `aria-label` when the surrounding heading does not describe it.

### Log examples

The Item docs include a live run status, phases separated by labelled rules, changed files with badges, and log links with a reversible action. These compose Item, Separator, Badge, Loader, Link and Button without a separate marker wrapper.
