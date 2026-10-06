# Carousel

> Core/Carousel · core · `@gaudi/design-system/core/Carousel`

Carousel renders standard feature slides and editorial card rails.

## Import

```js
import Carousel from '@gaudi/design-system/core/Carousel';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `CarouselContent`, `CarouselItem`, `CarouselNext`, `CarouselPrevious`, `CarouselRoot`, `carouselCardVariants`, `carouselSlideVariants`, `carouselVariants`, `default`, `useCarousel`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `Array<{ id, title, description, eyebrow, image, alt, href, action, content }>` | `[]` | no | Slide data. Standard uses the active item; apple renders the horizontal rail. |
| `ariaLabel` | `string` | `Carousel` | no | Accessible name for the carousel region. |
| `variant` | `standard \| rail \| apple` | `standard` | no | Slide format. Use rail for editorial card rails; apple remains a legacy alias. |
| `size` | `sm \| md \| lg` | `md` | no | Controls max width and slide/card height. |
| `radius` | `none \| sm \| md \| lg` | `lg` | no | Legacy aliases use the global --ds-radius setting; none keeps square corners. |
| `controls` | `boolean` | `true` | no | Shows previous and next buttons. |
| `loop` | `boolean` | `false` | no | Wraps previous/next navigation. |
| `className` | `string` | — | no | Root class override. |
| `classNames` | `{ root, header, viewport, track, slide, card, image, content, eyebrow, title, description, action, controls, control, indicators, indicator, dialog, overlay }` | — | no | Slot-level overrides for visual composition. |

## Variants

- `variant`: `standard`, `rail`, `apple`
- `size`: `sm`, `md`, `lg`
- `radius`: `none`, `sm`, `md`, `lg`

## Usage

```jsx
import { Carousel } from '@gaudi/design-system';

<Carousel
  ariaLabel='Featured articles'
  items={[
    { title: 'Design systems keep editorial rhythm predictable', eyebrow: 'Design Systems', description: 'A focused carousel item.', href: '/blog' },
  ]}
/>
```

## Accessibility

Carousel exposes a labelled carousel region, native previous/next buttons, aria-live status updates, keyboard arrow support, and named indicators.

## Examples

- Playground (Storybook `core-carousel--playground`)
- Editorial Rail (Storybook `core-carousel--editorial-rail`)

Curated patterns:

- Autoplay — registry item `@gaudi/carousel-autoplay` (uses `CardRoot`, `CarouselContent`, `CarouselItem`, `CarouselNext`, `CarouselPrevious`, `CarouselRoot`)
- Content overlays with dots — registry item `@gaudi/carousel-content-overlays` (uses `CardRoot`, `CarouselContent`, `CarouselItem`, `CarouselNext`, `CarouselPrevious`, `CarouselRoot`, `cn`)
- Layout options — registry item `@gaudi/carousel-layouts` (uses `CardRoot`, `CarouselContent`, `CarouselItem`, `CarouselNext`, `CarouselPrevious`, `CarouselRoot`, `Label`, `SwitchRoot`, `cn`)
- Thumbnail navigation — registry item `@gaudi/carousel-thumbnails` (uses `CarouselContent`, `CarouselItem`, `CarouselRoot`, `Label`, `SwitchRoot`, `cn`)

## README

Shows one item at a time, or a scrolling rail of cards, with previous and next buttons, dot indicators, and arrow-key navigation. Use it for featured content that readers browse in order; use a grid when every item should be visible at once.

```jsx
import { Carousel } from '@gaudi/design-system';

<Carousel
  ariaLabel='Featured articles'
  loop
  items={[
    { id: 'graphs', title: 'An Introduction to Knowledge Graphs', eyebrow: 'Knowledge Graphs', image: '/images/art/2.svg', href: '/blog', action: 'Read article' }
  ]}
/>
```

- `variant='standard'` shows one slide with its call to action. `variant='rail'` shows snapping cards; selecting a card opens its `content` in a dialog.
- `loop` wraps navigation at the ends. `controls={false}` hides the previous and next buttons; the indicators stay.
- `size` (`sm`, `md`, `lg`) sets the maximum width and slide height; `radius` sets the corners.

### Parts

`Carousel` is built on the `CarouselRoot`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, and `CarouselNext` parts. Compose them directly for custom layouts such as thumbnails, multiple slides per view, vertical carousels, or autoplay (pass Embla `opts` and `plugins` to `CarouselRoot`). `useCarousel` exposes the Embla API inside the root.
