# OgCard

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

## Contract

- `title` (string): long titles step down in size. `subtitle`, `category`, `siteName` (string) are optional.
- `logo` (ReactNode): a 120px mark in the top corner. Use an inline `<svg>` (`fill='currentColor'` follows the theme) or an `<img>` with a data URL.
- `theme` (`'light'` | `'dark'`, default `'light'`): neutral palettes with AA contrast; the bottom rule is the only accent.
- `width`, `height` (number, default 1200 × 630). `ogImageSize` exports the defaults.

## Boundaries

The module is server-safe: no `'use client'`, hooks, Tailwind classes, DOM-only components or network requests. Every element uses inline styles and flex layout, as Satori requires. Fonts come from the renderer: load them in the route and pass `fonts` to `ImageResponse`; Gaudi never fetches them. Give the page an `og:image:alt` that repeats the title.
