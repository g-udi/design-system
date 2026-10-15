# ScrollArea

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

## Faded edges

`fadeEdges` blurs the top and bottom of the viewport while more content continues past them. `ScrollEdges` is the same effect for any scroll boundary: pass `targetRef`, or omit it for the page, with `offsetTop` to keep the top edge below a sticky header.

```jsx
import { ScrollArea, ScrollEdges } from '@gaudi/design-system/core/ScrollArea';

<ScrollArea smooth fadeEdges className='h-[32rem]' aria-label='Blog post content'>{article}</ScrollArea>
<ScrollEdges offsetTop={64} />
```

The edges are decorative: they never take pointer events, disappear while anything has keyboard focus, and are hidden for reduced motion and in forced colours. A page that scrolls as a whole, such as a blog post between a site header and footer, keeps native page scrolling and uses `ScrollEdges` without `targetRef`; use a bounded `ScrollArea` when the reading area is the only scroller.

The `Smooth blog reading` story demonstrates the intended composition, heading links, a contained reading list, custom thumb styling, and reading progress. [Shadix UI Smooth Scroll Area](https://shadix-ui.vercel.app/docs/components/smooth-scroll-area) informed the behavior; Gaudi uses its existing Radix primitive and [Lenis](https://github.com/darkroomengineering/lenis) rather than copied registry source.
