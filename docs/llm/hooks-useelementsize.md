# useElementSize

> Hooks/Layout/useElementSize · hooks · `@gaudi/design-system/hooks`

Measures the border box and follows resizes, for container-driven layouts, truncation and drawing at real pixel sizes. Returns a callback ref and the size; onResize receives each size without a render.

## Import

```js
import { useElementSize } from '@gaudi/design-system/hooks';
```

Exports: `useElementSize`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.initialSize` | `{ width, height }` | `{ width: 0, height: 0 }` | no | Size on the server and before the first measurement. |
| `options.onResize` | `(size) => void` | — | no | Called with each measured size. |
| `options.round` | `boolean` | `true` | no | Round to whole pixels. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `[0] ref` | `(node) => void` | Callback ref for the element. |
| `[1] size` | `{ width, height }` | The current size in pixels. |

## Usage

```jsx
import { useElementSize } from '@gaudi/design-system/hooks';

const [ref, { width }] = useElementSize();
<div ref={ref}>{width < 480 ? <CompactCard /> : <WideCard />}</div>
```

## Accessibility

Size-driven layouts must still reflow at 400% zoom and keep reading order; prefer CSS container queries when only styles change.

## Notes

- Charts measure themselves; use this for your own canvases and layouts.

## Examples

- Layout from the container width (Storybook `hooks-layout-useelementsize--container-layout`)
