# Item

A flexible row for lists of people, settings, integrations, navigation links, activity and run logs. Compose media, a title and description, trailing actions, and an optional header or footer; group rows with `ItemGroup` and divide them with `ItemSeparator`.

## Usage

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

## Parts

| Part | Contract |
| --- | --- |
| `Item` | `variant` (default, outline, muted), `size` (default, sm, xs), `as` for the element and `asChild` to render a link or button. |
| `ItemMedia` | `variant` default, icon or image. |
| `ItemContent`, `ItemTitle`, `ItemDescription` | Main text column; the description clamps to two lines. |
| `ItemActions` | Trailing badges, buttons or menus. |
| `ItemHeader`, `ItemFooter` | Full-width rows above and below the content. |
| `ItemGroup`, `ItemSeparator` | A `role='group'` list wrapper and a horizontal divider. |

## Accessibility

Use `asChild` with a link when the whole row navigates, and keep independent actions outside that link. Name icon-only actions after their row ("Remove Odile Marchetti"). Give a group of rows an accessible name with `aria-label` when the surrounding heading does not describe it.

## Log examples

The Item docs include a live run status, phases separated by labelled rules, changed files with badges, and log links with a reversible action. These compose Item, Separator, Badge, Loader, Link and Button without a separate marker wrapper.
