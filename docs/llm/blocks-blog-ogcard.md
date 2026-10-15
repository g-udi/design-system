# OgCard

> Blocks/Blog/OgCard · post · `@gaudi/design-system/post/OgCard`

Open Graph image template for next/og ImageResponse: category, title, subtitle, site name and an optional logo on a neutral light or dark card, built only from inline styles.

## Import

```js
import OgCard from '@gaudi/design-system/post/OgCard';
// also: import { … } from '@gaudi/design-system/post';
```

Exports: `OgCard`, `default`, `ogImageSize`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | — | no | The page or post title; long titles step down in size. |
| `subtitle` | `string` | — | no | Supporting line below the title. |
| `category` | `string` | — | no | Short uppercase label above the title. |
| `siteName` | `string` | — | no | Site name or URL along the bottom edge. |
| `logo` | `ReactNode` | — | no | Mark in the top corner, 120px square: an inline svg (fill='currentColor' follows the theme) or an img with a data URL. No remote URLs. |
| `theme` | `light \| dark` | `light` | no | Neutral palette. |
| `width / height` | `number` | `1200 / 630` | no | Image size; ogImageSize exports the defaults for ImageResponse. |

## Variants

- `theme`: `light`, `dark`

## Usage

```jsx
// app/api/og/route.js
import { ImageResponse } from 'next/og';
import { OgCard, ogImageSize } from '@gaudi/design-system/post/OgCard';

export function GET() {
  return new ImageResponse(
    <OgCard title='Notes on local-first software' subtitle='What syncing taught me.' category='Engineering' siteName='example.com' />,
    ogImageSize
  );
}
```

## Accessibility

The card becomes an image, so the page's og:image:alt (or the alt of an img that shows it) must repeat the title. Both palettes keep AA contrast for every text role.

## Examples

- Playground (Storybook `post-og-card--playground`)

## Related

`mdx-image`

## README

A social preview (Open Graph) image template for [`next/og`](https://nextjs.org/docs/app/api-reference/functions/image-response) `ImageResponse` and other Satori renderers.

```jsx
// app/api/og/route.js
import { ImageResponse } from 'next/og';
import { OgCard, ogImageSize } from '@gaudi/design-system/post/OgCard';

export function GET(request) {
  const title = request.nextUrl.searchParams.get('title') || 'Example';

  return new ImageResponse(
    <OgCard title={ title } subtitle='What syncing taught me.' category='Engineering' siteName='example.com' logo={ <Logo /> } />,
    ogImageSize // { width: 1200, height: 630 }; add `fonts` here to use your own faces
  );
}
```

### Contract

- `title` (string): long titles step down in size. `subtitle`, `category`, `siteName` (string) are optional.
- `logo` (ReactNode): a 120px mark in the top corner. Use an inline `<svg>` (`fill='currentColor'` follows the theme) or an `<img>` with a data URL.
- `theme` (`'light'` | `'dark'`, default `'light'`): neutral palettes with AA contrast; the bottom rule is the only accent.
- `width`, `height` (number, default 1200 × 630). `ogImageSize` exports the defaults.

### Boundaries

The module is server-safe: no `'use client'`, hooks, Tailwind classes, DOM-only components or network requests. Every element uses inline styles and flex layout, as Satori requires. Fonts come from the renderer: load them in the route and pass `fonts` to `ImageResponse`; Gaudi never fetches them. Give the page an `og:image:alt` that repeats the title.
