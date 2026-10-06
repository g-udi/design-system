# Pill

> Core/Pill · core · `@gaudi/design-system/core/Pill`

Pill renders compact category and status labels.

## Import

```js
import Pill from '@gaudi/design-system/core/Pill';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Badge`, `BadgeRoot`, `badgeVariants`, `badgeVariantsPrimitive`, `default`, `pillSizes`, `pillTones`, `pillVariants`

## When to use

- Use Pill for compact metadata, tags, filters, and status labels.
- Keep the visible label as the source of meaning; color only supports scanning.
- Use the Badge `discovery` variants for suggested or machine-generated labels and `attention` for items that need a person to look, such as staged or unreviewed records; each has solid, `-light` and `-outline` treatments.

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | Visible category, status, or tag label. |
| `size` | `xs \| sm \| md \| lg` | `md` | no | Controls padding and text size. |
| `tone` | `gray \| neutral \| blue \| teal \| green \| amber \| yellow \| red \| rose \| indigo` | `blue` | no | Semantic tone alias mapped through Gaudi tokens rather than raw palette utilities. |
| `variant` | `solid \| soft \| outline \| ghost \| subtle` | `solid` | no | Visual treatment. |
| `radius` | `sm \| md \| full` | `sm` | no | Legacy aliases use the global --ds-radius setting (4px by default); none stays square where supported. |
| `href` | `string` | — | no | Renders the pill as a navigation link. |
| `icon` | `ReactNode` | — | no | Decorative leading icon. |
| `pulse` | `boolean` | `false` | no | Adds a pulsing status dot. |
| `className` | `string` | — | no | Root class override. |

## Variants

- `size`: `xs`, `sm`, `md`, `lg`
- `tone`: `gray`, `neutral`, `blue`, `teal`, `green`, `amber`, `yellow`, `red`, `rose`, `indigo`
- `variant`: `solid`, `soft`, `outline`, `ghost`, `subtle`
- `radius`: `sm`, `md`, `full`

## Usage

```jsx
import { Pill } from '@gaudi/design-system';

<Pill tone='blue' variant='solid' size='sm'>Engineering</Pill>
```

## Accessibility

Pill includes visible text so status or category meaning is not color-only.

## Examples

- Playground (Storybook `core-pill--playground`)
- Tones (Storybook `core-pill--tones`)
- Semantic Badges (Storybook `core-pill--semantic-badges`)

Curated patterns:

- Icons, dots, avatars and images — registry item `@gaudi/badge-icons-avatars` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `RegistryIcon`)
- Removable filters and links — registry item `@gaudi/badge-removable-filters` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `RegistryIcon`)
- Sizes, counts and labels — registry item `@gaudi/badge-sizes-counts` (uses `Badge`)
- Variants — registry item `@gaudi/badge-variants` (uses `Badge`)

## README

A small label for a status, category, tag or count. Use `Pill` when you want a named tone (`blue`, `green`, `amber`…) with a
`variant` for emphasis; use `Badge` when you compose with the semantic variants (`success-light`, `destructive-outline`…).
Both render the same Badge element, and Pill tones read from the shared Button tone scale, so they switch with the theme.

```jsx
import { Badge, Pill } from '@gaudi/design-system';

<Pill tone='green' variant='soft' size='sm' pulse>Live</Pill>
<Pill href='/blog/tags/tokens' tone='gray' variant='soft'>#tokens</Pill>
<Badge variant='success-light'>Shipped</Badge>
<Badge variant='discovery-light'>Suggested</Badge>
<Badge variant='attention-light'>Needs review</Badge>
```

- `tone`: `blue` (default), `green`, `amber`, `red`, `indigo`, `teal`, `rose`, `neutral`, `gray`; `yellow` is an alias of `amber`.
- `variant`: `solid` (default), `soft`, `outline`, `ghost`, `subtle`. `size`: `xs`, `sm`, `md` (default), `lg`. `radius`: `sm` (default), `md`, `full`.
- `href` renders a link with a comfortable hit target; `icon` adds a decorative leading icon; `pulse` adds a decorative live dot, so keep the meaning in the text.
- `Badge` variants: `default`, `secondary`, `outline`, and the semantic `info`, `success`, `warning`, `destructive`,
  `discovery`, `attention`, `focus`, `invert`, each with `-light` and `-outline` treatments (`primary-light`/`primary-outline` too).
  Use `discovery` for suggested or generated labels (for example tags proposed by an assistant) and `attention` for records
  that need a person to look (staged, unreviewed). They read from the `--ds-color-discovery*` and `--ds-color-attention*` tokens.
- `BadgeRoot` and `badgeVariantsPrimitive` are kept as aliases of `Badge` and `badgeVariants`.
