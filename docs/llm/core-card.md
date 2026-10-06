# Card

> Core/Card · core · `@gaudi/design-system/core/Card`

Card frames reusable content with title, subtitle, and optional children.

## Import

```js
import Card from '@gaudi/design-system/core/Card';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `CardAction`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `Frame`, `FrameDescription`, `FrameFooter`, `FrameHeader`, `FramePanel`, `FrameTitle`, `cardVariants`, `default`, `frameVariants`

## When to use

- Use Card to frame one reusable content unit, not as page scaffolding.
- Put real links and buttons inside the card instead of turning the whole surface into a fake control.
- Avoid nested cards; separate sections with spacing or a table/list pattern instead.

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | — | no | Optional card heading. |
| `titleLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | no | Semantic level for the optional card heading. |
| `subtitle` | `ReactNode` | — | no | Supporting description under the title. |
| `children` | `ReactNode` | — | no | Body content, actions, or nested composition. |
| `variant` | `elevated \| outline \| soft \| flat` | `elevated` | no | Container surface treatment. |
| `padding` | `none \| sm \| md \| lg` | `md` | no | Internal spacing. |
| `radius` | `none \| sm \| md \| lg` | `md` | no | Legacy aliases use the global --ds-radius setting (4px by default); none stays square where supported. |
| `interactive` | `boolean` | `false` | no | Adds hover elevation for cards containing a real link or button. |
| `className` | `string` | — | no | Root class override. |
| `classNames` | `{ root, body, title, subtitle }` | — | no | Slot-level class overrides. |

## Variants

- `titleLevel`: `2`, `3`, `4`, `5`, `6`
- `variant`: `elevated`, `outline`, `soft`, `flat`
- `padding`: `none`, `sm`, `md`, `lg`
- `radius`: `none`, `sm`, `md`, `lg`

## Usage

```jsx
import { Card } from '@gaudi/design-system';

<Card title='Building with tokens' subtitle='Cards frame reusable content.' />
```

## Accessibility

Card is a structural container. Put links or buttons inside it rather than making the whole card a fake control.

## Examples

- Playground (Storybook `core-card--playground`)
- Variants (Storybook `core-card--variants`)
- Responsive card grid (Storybook `core-card--responsive-grid`)

Curated patterns:

- Usage meters that expand — registry item `@gaudi/card-billing-usage` (uses `Button`, `CardAction`, `CardContent`, `CardHeader`, `CardRoot`, `CardTitle`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `ProgressRoot`, `RegistryIcon`, `cn`)
- Deployment status — registry item `@gaudi/card-deployment-status` (uses `CardContent`, `CardRoot`, `RegistryIcon`, `cn`)
- Header badge and actions — registry item `@gaudi/card-header-actions` (uses `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `CardContent`, `CardRoot`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `Link`, `RegistryIcon`, `useCopyToClipboard`)
- Link cards — registry item `@gaudi/card-link-cards` (uses `CardContent`, `CardRoot`, `Link`, `RegistryIcon`)
- Login form — registry item `@gaudi/card-login-form` (uses `Button`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `EmailInput`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FieldSeparator`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `Link`, `RegistryIcon`)
- Media cards — registry item `@gaudi/card-media` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `CardContent`, `CardRoot`, `Label`, `RegistryIcon`, `SwitchRoot`, `cn`)
- Sections and dividers — registry item `@gaudi/card-sections` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `CardAction`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `Label`, `RegistryIcon`, `SwitchRoot`, `cn`)
- Stat with trend and menu — registry item `@gaudi/card-stat-trend` (uses `Badge`, `Button`, `CardContent`, `CardRoot`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `Link`, `RegistryIcon`, `Separator`, `useCopyToClipboard`)

## README

A bordered surface that frames one unit of content: an article teaser, a metric, a settings group. Use it when content needs a visible boundary; use spacing or a list instead for page structure.

```jsx
import { Card } from '@gaudi/design-system';

<Card title='Weekly readers' subtitle='Last 7 days' variant='outline' padding='sm'>
  <p>12.4k</p>
</Card>
```

- `variant`: `elevated` (default), `outline`, `soft`, or `flat`. `padding`: `none`, `sm`, `md` (default), `lg`. `radius`: `none`, `sm`, `md`, `lg`.
- `title`, `subtitle`, and `titleLevel` (2-6, default 3) render the heading and description with the `CardTitle` and `CardDescription` parts.
- `interactive` adds hover elevation. Keep real links and buttons inside the card rather than making the whole surface clickable.

### Parts

For headers with actions or a footer, compose `CardRoot`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter`. `CardTitle` and `CardDescription` accept `as` to render a heading or paragraph.

`Frame`, `FramePanel`, `FrameHeader`, `FrameTitle`, `FrameDescription`, and `FrameFooter` build a tinted tray that holds one or more panels, such as stacked settings sections.

`Card` and `CardRoot` use the same surface and variant implementation. `Card` supplies a padded title/body composition; `CardRoot` defaults to section spacing for `CardHeader`, `CardContent`, and `CardFooter`. Zero-valued titles and descriptions are preserved.
