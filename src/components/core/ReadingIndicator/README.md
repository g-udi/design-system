# ReadingIndicator

Track reading position with a top bar, vertical ruler, or circular meter.

```jsx
import { ReadingIndicator } from '@gaudi/design-system/core/ReadingIndicator';

<ReadingIndicator />
```

The default bar is fixed to the top of the page. Set `style={{ top: 64 }}` to clear a fixed header. `variant='ruler'` sits at the end edge; `variant='ring'` sits at the bottom end. Both show a percentage by default. `tone` accepts `accent` or `neutral`.

Pass `targetRef` for a scrolling element or a Gaudi `ScrollArea` root. Inside a panel, use `position='absolute'` and a positioned parent; `position='inline'` leaves placement to the host. Reserve a gutter for the ruler and space for the ring so they do not obscure text.

`contentRef` restricts progress to an article inside the scroll target: 0% when its top reaches the top of the viewport, 100% when its bottom comes into view. Related content is excluded. A fully visible, non-scrollable range is complete. Missing refs remain at 0%. Resizes and dynamic content update the range.

For externally measured progress, set `value` (0–100). Values are clamped; non-finite values become 0. Automatic scroll tracking is suspended while `value` is supplied.

`draggable` gives the ring a handle. `dragBoundsRef` constrains it to a panel; otherwise it stays within the viewport. Arrow keys move by 10px, Shift by 40px; Home or Escape resets it. Inline meters are not draggable. The handle is the only pointer-interactive part.

Use `label` or `aria-labelledby` to name the progressbar. No live region announces every scroll. Reduced motion disables the number transition. Progress describes position, not reading comprehension. The ref and DOM props belong to the outer container.

Visual references: [Skiper UI scroll progress 003](https://skiper-ui.com/v1/skiper95) and [scroll progress 001](https://skiper-ui.com/v1/skiper89). This implementation composes Gaudi progress primitives and Motion; it does not copy registry source or load remote resources.
