# Banner

> Core/Banner · core · `@gaudi/design-system/core/Banner`

Banner renders a compact announcement strip.

## Import

```js
import Banner from '@gaudi/design-system/core/Banner';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Alert`, `AlertAction`, `AlertActionPrimitive`, `AlertDescription`, `AlertDescriptionPrimitive`, `AlertRoot`, `AlertTitle`, `AlertTitlePrimitive`, `bannerTones`, `bannerVariants`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | — | no | Optional bold leading text. |
| `children` | `ReactNode` | — | no | Announcement body copy. |
| `href` | `string` | — | no | Turns the banner copy into a navigation link. |
| `ariaLabel` | `string` | `Rendered content` | no | Optional accessible-name override for linked banners. |
| `size` | `xs \| sm \| md \| lg` | `md` | no | Controls vertical and horizontal padding. |
| `tone` | `neutral \| accent \| info \| success \| warning \| danger \| attention \| discovery` | `neutral` | no | Semantic tone. Hue names (blue, green, amber…) still resolve to these. |
| `variant` | `solid \| soft \| outline` | `soft` | no | Visual treatment. |
| `className` | `string` | — | no | Root class override. |
| `classNames` | `{ root, body, action }` | — | no | Slot-level class overrides. |

## Variants

- `size`: `xs`, `sm`, `md`, `lg`
- `tone`: `neutral`, `accent`, `info`, `success`, `warning`, `danger`, `attention`, `discovery`
- `variant`: `solid`, `soft`, `outline`

## Usage

```jsx
import { Banner } from '@gaudi/design-system';

<Banner title='Now published' href='/blog'>
  New essays and project notes are available.
</Banner>
```

## Accessibility

Static banners use status semantics. Linked banners derive their accessible name from the rendered title and body, including rich content; ariaLabel provides an explicit override.

## Examples

- Playground (Storybook `core-banner--playground`)
- Tones and variants (Storybook `core-banner--tones-and-variants`)

Curated patterns:

- Alert: Dismissible notices — registry item `@gaudi/alert-dismissible` (uses `Alert`, `AlertAction`, `AlertDescription`, `AlertTitle`, `Button`, `Frame`, `FramePanel`, `RegistryIcon`)
- Alert: Message notification — registry item `@gaudi/alert-message-notice` (uses `Alert`, `AlertAction`, `AlertDescription`, `AlertTitle`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `Frame`, `FramePanel`)
- Alert: Actions and rich content — registry item `@gaudi/alert-rich-actions` (uses `Alert`, `AlertAction`, `AlertDescription`, `AlertTitle`, `Button`, `RegistryIcon`)
- Alert: Service status summary — registry item `@gaudi/alert-service-status` (uses `Alert`, `AlertAction`, `AlertDescription`, `AlertTitle`, `Button`, `Frame`, `FramePanel`, `RegistryIcon`)
- Alert: Variants — registry item `@gaudi/alert-variants` (uses `Alert`, `AlertDescription`, `AlertTitle`, `RegistryIcon`)

## README

A banner is a full-width strip for a site-wide message: a release, maintenance, or a billing problem. For a message inside the page, next to the content it is about, compose `Alert`.

```jsx
import { Banner } from '@gaudi/design-system';

<Banner title='Gaudi 2.0 is out' href='/changelog' tone='accent' variant='solid'>
  New tokens and a faster docs site.
</Banner>
```

- `tone` carries meaning (`neutral`, `accent`, `info`, `success`, `warning`, `danger`, `attention`, `discovery`); older hue names still work.
- `variant`: `solid` for the one announcement that matters most, `soft` or `outline` for routine notices. `size` sets the padding.
- With `href` the whole message is one link; without it the banner is announced as a status.

### Alert

`Alert`, `AlertTitle`, `AlertDescription` and `AlertAction` build an inline message with an icon, text and actions. `variant` is `default`, `info`, `success`, `warning`, `destructive` or `invert`. `AlertRoot` and the `*Primitive` names are aliases of the same parts.
