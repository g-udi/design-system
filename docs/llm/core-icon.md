# Icon

> Core/Icon · core · `@gaudi/design-system/core/Icon`

Static and interactive artwork from Gaudi’s centralized icon registry. AnimatedIcon adds opt-in motion with shared size and color tokens, a searchable catalogue, and host-controlled activation.

## Import

```js
import Icon from '@gaudi/design-system/core/Icon';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `AnimatedIcon`, `IconStack`, `IconTile`, `animatedIconMetadata`, `animatedIconRegistry`, `default`, `getIcon`, `iconColors`, `iconLabels`, `iconRegistry`, `iconSizes`, `iconTileVariants`

## When to use

- Use the Gaudi icon registry; do not import vendor icons directly outside `src/icons/index.jsx`.
- Mark decorative icons as decorative and label meaningful icon-only controls.
- Keep icon size and stroke aligned with the surrounding text or control.

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `registry icon name` | — | no | Renders an icon from the Gaudi registry. |
| `kind` | `github \| linkedin \| twitter \| youtube \| mail \| ...` | — | no | Compatibility alias for social/link icon use. |
| `href` | `string` | — | no | Renders the icon as a safe link when provided. |
| `label` | `string` | — | no | Accessible label for informative icons and icon links. |
| `decorative` | `boolean` | `false` | no | Hides the SVG from assistive technology when the icon is visual only. |
| `size` | `xs \| sm \| md \| lg \| xl \| 2xl \| number` | `md` | no | Controls icon dimensions. |
| `color` | `neutral \| muted \| primary \| info \| success \| warning \| danger \| attention \| blue \| teal \| green \| amber \| yellow \| red \| rose \| dim` | `currentColor` | no | Token color shortcut. |
| `strokeWidth` | `number` | `icon default` | no | Adjusts line icon stroke width. Filled brand icons such as Github ignore it. |
| `active` | `boolean (AnimatedIcon)` | `false` | no | Starts motion when the host is active and visible. Reduced motion and hidden documents keep the resting artwork. |
| `className` | `string` | — | no | Root class override. |

## Variants

- `kind`: `github`, `linkedin`, `twitter`, `youtube`, `mail`, `...`
- `color`: `neutral`, `muted`, `primary`, `info`, `success`, `warning`, `danger`, `attention`, `blue`, `teal`, `green`, `amber`, `yellow`, `red`, `rose`, `dim`

## Usage

```jsx
import { Icon } from '@gaudi/design-system';

<Icon name='Info' label='More information' color='primary' size='lg' />
```

## Accessibility

Decorative icons are hidden from assistive technology. Informative or icon-only links need a readable label.

## Examples

- Playground (Storybook `core-icon--playground`)
- Social Link (Storybook `core-icon--social-link`)
- Sizes, colors and stroke widths (Storybook `core-icon--sizes`)
- Animated icons (Storybook `core-icon--animated-motion`)

Curated patterns:

- In an empty state and list row — registry item `@gaudi/icon-stack-in-context` (uses `Button`, `Empty`, `EmptyContent`, `EmptyDescription`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `IconStack`, `Item`, `ItemContent`, `ItemDescription`, `ItemMedia`, `ItemTitle`, `RegistryIcon`)
- Sizes, colors and badge — registry item `@gaudi/icon-stack-sizes-badge` (uses `IconStack`, `RegistryIcon`)
- In a card, list row and empty state — registry item `@gaudi/icon-tile-in-context` (uses `Empty`, `EmptyDescription`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `Frame`, `FramePanel`, `IconTile`, `Item`, `ItemActions`, `ItemContent`, `ItemDescription`, `ItemMedia`, `ItemTitle`, `RegistryIcon`)
- Tones — registry item `@gaudi/icon-tile-tones` (uses `IconTile`, `RegistryIcon`)
- Variants, sizes and shapes — registry item `@gaudi/icon-tile-variants` (uses `IconTile`, `RegistryIcon`)

## README

Icons from the Gaudi registry at token sizes and semantic colours. Pass `label` when the icon carries meaning on its
own, or `decorative` when text beside it already does. `kind` with `href` renders a labelled social or email link.

```jsx
import { AnimatedIcon, Icon, IconStack, IconTile } from '@gaudi/design-system';

<Icon name='Info' size='lg' color='primary' label='More information' />
<IconTile variant='soft' size='lg'><Icon name='Star' decorative /></IconTile>
<AnimatedIcon name='Bell' active={hovered} size='md' color='primary' />
```

- `IconTile` frames an icon as media in lists, cards and empty states (`outline`, `elevated`, `soft`, `solid`, `frame`;
  sizes `xs` to `xl`; `radius='full'` for circles). Retint it with text and background tokens.
- `IconStack` draws a layered stack of cards behind an icon for empty and onboarding states.
- `AnimatedIcon` moves only while the host sets `active`, and rests for reduced motion, offscreen placement and hidden documents.
