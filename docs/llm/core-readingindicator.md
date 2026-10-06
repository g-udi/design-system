# ReadingIndicator

> Core/ReadingIndicator · core · `@gaudi/design-system/core/ReadingIndicator`

Reading progress as a classic top bar, a vertical ruler with a moving percentage, or a movable circular meter.

## Import

```js
import { ReadingIndicator } from '@gaudi/design-system/core/ReadingIndicator';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `ReadingIndicator`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `bar \| ruler \| ring` | `bar` | no | A thin horizontal bar, a vertical tick scale, or a compact circular meter. |
| `position` | `fixed \| absolute \| inline` | `fixed` | no | Fixed to the viewport, anchored inside a positioned parent, or placed in normal layout. Bar sits at the top; ruler at the end edge; ring at the bottom end. |
| `targetRef` | `Ref<HTMLElement>` | `window` | no | Ref to a scrolling element or a Gaudi ScrollArea root. Omit to track the document. |
| `contentRef` | `Ref<HTMLElement>` | `whole scroll range` | no | Optional article inside the scroll target. Starts when its top reaches the viewport top; finishes when its bottom comes into view. |
| `value` | `number (0–100)` | `automatic` | no | Supply an external reading percentage to bypass scroll tracking. Clamped to 0–100; non-finite values become 0. |
| `tone` | `accent \| neutral` | `accent` | no | Accent or foreground marks, adapted to the current theme. |
| `showValue` | `boolean` | `false for bar; true otherwise` | no | Shows the percentage next to the indicator. |
| `label` | `string` | `Reading progress` | no | Accessible name for the progressbar. aria-labelledby can name it from an existing heading. |
| `draggable` | `boolean` | `false` | no | Adds a movement handle to a fixed or absolute ring. Arrow keys move it; Home or Escape resets it. |
| `dragBoundsRef` | `Ref<HTMLElement>` | `viewport` | no | Constrains the movable ring to this container. Set it for a ring positioned inside a panel. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `variant`: `bar`, `ruler`, `ring`
- `position`: `fixed`, `absolute`, `inline`
- `tone`: `accent`, `neutral`

## Usage

```jsx
import { ReadingIndicator } from '@gaudi/design-system/core/ReadingIndicator';

// Render once near the page root.
<ReadingIndicator />
```

## Accessibility

Exposes a named progressbar without live announcements on every scroll. The indicator does not capture scrolling or text selection; only the optional ring handle receives input. Reduced motion removes the number transition. Progress measures scroll position, not comprehension.

## Notes

- Resizes and content growth are measured automatically. A non-scrollable document is complete (100%); an unresolved target starts at 0%.
- Reserve a side gutter for the ruler and room for the ring so they do not cover reading text. Set style.top to place a fixed bar below a site header. For a top bar with no extra configuration, render <ReadingIndicator /> once in the page.
- The ruler and ring are independently implemented interpretations of the Skiper UI scroll progress references; no remote assets or registry code are loaded.

## Examples

- Playground (Storybook `core-readingindicator--playground`)
- Bar, ruler and ring (Storybook `core-readingindicator--styles`)
- Article range (Storybook `core-readingindicator--article`)
- Top of page (Storybook `core-readingindicator--page`)

## Related

`core-progress`, `core-scrollarea`

## README

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
