# ScrollArea

> Core/ScrollArea · core · `@gaudi/design-system/core/ScrollArea`

Contained scrolling with themed scrollbars and optional smooth wheel motion for article reading.

## Import

```js
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `ScrollArea`, `ScrollBar`, `ScrollEdges`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `type` | `auto \| always \| scroll \| hover` | `hover` | no | Scrollbar visibility behavior. |
| `smooth` | `boolean` | `false` | no | Enhances vertical mouse-wheel scrolling with Lenis. Touch, keyboard, focus, links and reduced motion retain native behavior. The engine loads only when requested and pauses when the area or page is hidden. |
| `fadeEdges` | `boolean` | `false` | no | Blurs the top and bottom edges while more content continues past them. Decorative: hidden during keyboard focus, for reduced motion and in forced colours. |
| `ScrollEdges.targetRef` | `Ref<HTMLElement>` | `page` | no | The same edges for any scroll boundary: an element, or the page when targetRef is omitted. offsetTop keeps the page top edge below a sticky header; range is the distance in pixels at which an edge reaches full strength. |
| `offsetTop` | `number` | `0` | no | The same edges for any scroll boundary: an element, or the page when targetRef is omitted. offsetTop keeps the page top edge below a sticky header; range is the distance in pixels at which an edge reaches full strength. |
| `range` | `number` | `80` | no | The same edges for any scroll boundary: an element, or the page when targetRef is omitted. offsetTop keeps the page top edge below a sticky header; range is the distance in pixels at which an edge reaches full strength. |
| `viewportRef` | `Ref<HTMLElement>` | — | no | Ref to the actual scrolling viewport. Share with ReadingIndicator.targetRef, a heading observer or native scrollTo calls. The ordinary ref still points to the outer root. |
| `scrollbarClassName` | `{ track?: string, thumb?: string }` | — | no | Classes for the built-in vertical scrollbar track and thumb, using Gaudi tokens. |
| `ScrollBar.orientation` | `horizontal \| vertical` | `vertical` | no | Axis of an additional scrollbar. Smooth wheel motion applies to the vertical viewport; horizontal regions remain native. |
| `ScrollBar.thumbClassName` | `string` | — | no | Classes for a separately composed scrollbar thumb. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `type`: `auto`, `always`, `scroll`, `hover`

## Usage

```jsx
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';

<ScrollArea smooth className='h-[32rem]' aria-label='Blog post content'>{article}</ScrollArea>
```

## Accessibility

Give the viewport a useful accessible name using aria-label or aria-labelledby. Constrain the area dimensions and retain keyboard access. Reduced motion skips the smooth engine entirely; native scrolling remains available before hydration or if the enhancement cannot load. Nested scrollable content keeps its own wheel behavior.

## Notes

- A page that scrolls as a whole, such as a blog post between a site header and footer, keeps native page scrolling and uses ScrollEdges without targetRef for the same blurred edges. Use a bounded ScrollArea when the reading area is the only scroller, as in the Article examples.
- Smooth scrolling is an enhancement to the existing ScrollArea owner, not a second global page scroller. Bound the height, including min-h-0 when using a flex layout. Avoid stacking a second document-wide smoothing engine around it.
- Native fragment links, keyboard scrolling, focus, text selection and touch retain browser behavior. Pointer and keyboard intent interrupt any pending wheel inertia. Code, tables and other nested scroll regions scroll natively.
- Theme the track and thumb through scrollbarClassName. Keep enough contrast and an adequate hit area. Use ScrollBar with orientation="horizontal" for content that deliberately overflows horizontally.
- Inspired by Shadix UI Smooth Scroll Area. Gaudi composes its existing Radix viewport with the packaged Lenis engine; it does not load remote scripts or copy registry source.

## Examples

- Smooth blog reading (Storybook `core-scrollarea--smooth-reading`)
- Playground (Storybook `core-scrollarea--playground`)

Curated patterns:

- Horizontal gallery — registry item `@gaudi/scroll-area-horizontal-gallery` (uses `ScrollArea`, `ScrollBar`, `cn`)
- Wide table — registry item `@gaudi/scroll-area-wide-table` (uses `ScrollArea`, `ScrollBar`, `TableBodyPrimitive`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`)

## Related

`blocks-blog-article`, `core-pointer`, `mdx-code`, `core-readingindicator`

## README

A keyboard-accessible Radix scroll viewport with themed scrollbars. Enable `smooth` for eased vertical mouse-wheel scrolling through the locally installed Lenis engine.

```jsx
'use client';

import { useRef } from 'react';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import { ReadingIndicator } from '@gaudi/design-system/core/ReadingIndicator';

export function ArticleReader({ children }) {
  const viewport = useRef(null);
  return (
    <div className='relative min-h-0'>
      <ScrollArea smooth viewportRef={viewport} className='h-[calc(100dvh-4rem)]' aria-label='Blog post content'>
        <article className='mx-auto max-w-prose px-5 py-8'>{children}</article>
      </ScrollArea>
      <ReadingIndicator targetRef={viewport} position='absolute' />
    </div>
  );
}
```

- `smooth` defaults to `false`. `true` adds wheel interpolation, with native scrolling available before hydration and if the enhancement cannot load. It applies to vertical wheel movement, not CSS scroll snapping or a document-wide smooth-scroll engine.
- `viewportRef` receives the actual scrolling element; `ref` receives the outer root. Use native `scrollTo`, or share the viewport with reading progress and heading observers.
- `type` controls scrollbar visibility: `hover` (default), `auto`, `always`, or `scroll`.
- `scrollbarClassName={{ track, thumb }}` styles the built-in vertical scrollbar. For example, `{ thumb: 'bg-accent/60' }` uses the active accent. `ScrollBar` also accepts `thumbClassName` and `orientation='horizontal'`.
- Give the region an `aria-label` or `aria-labelledby`. Set a bounded height, and use `min-h-0` on flex parents so the content scrolls inside the area.

Touch, keyboard scrolling, native fragment links, focus, selection, and scrollbar dragging retain their browser behavior. Nested scroll regions keep their own wheel interaction. Pointer, keyboard and focus intent interrupt wheel inertia. Reduced motion skips Lenis entirely; changing the preference takes effect without a reload. The engine is destroyed while the area is offscreen or the page is hidden, and on unmount, releasing its listeners, observers and animation frame.

### Faded edges

`fadeEdges` blurs the top and bottom of the viewport while more content continues past them. `ScrollEdges` is the same effect for any scroll boundary: pass `targetRef`, or omit it for the page, with `offsetTop` to keep the top edge below a sticky header.

```jsx
import { ScrollArea, ScrollEdges } from '@gaudi/design-system/core/ScrollArea';

<ScrollArea smooth fadeEdges className='h-[32rem]' aria-label='Blog post content'>{article}</ScrollArea>
<ScrollEdges offsetTop={64} />
```

The edges are decorative: they never take pointer events, disappear while anything has keyboard focus, and are hidden for reduced motion and in forced colours. A page that scrolls as a whole, such as a blog post between a site header and footer, keeps native page scrolling and uses `ScrollEdges` without `targetRef`; use a bounded `ScrollArea` when the reading area is the only scroller.

The `Smooth blog reading` story demonstrates the intended composition, heading links, a contained reading list, custom thumb styling, and reading progress. [Shadix UI Smooth Scroll Area](https://shadix-ui.vercel.app/docs/components/smooth-scroll-area) informed the behavior; Gaudi uses its existing Radix primitive and [Lenis](https://github.com/darkroomengineering/lenis) rather than copied registry source.
