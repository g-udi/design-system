# Carousel

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

## Parts

`Carousel` is built on the `CarouselRoot`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, and `CarouselNext` parts. Compose them directly for custom layouts such as thumbnails, multiple slides per view, vertical carousels, or autoplay (pass Embla `opts` and `plugins` to `CarouselRoot`). `useCarousel` exposes the Embla API inside the root.
