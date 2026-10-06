# useScrollPosition

> Hooks/Layout/useScrollPosition · hooks · `@gaudi/design-system/hooks`

Follows window scrolling, or the element in targetRef, with a passive listener. 0 during server rendering.

## Import

```js
import { useScrollPosition } from '@gaudi/design-system/hooks';
```

Exports: `useScrollPosition`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.targetRef` | `RefObject<HTMLElement>` | `the page` | no | Scroll container to follow instead of the window. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `scrollY` | `number` | Pixels scrolled from the top. |

## Usage

```jsx
import { useScrollPosition } from '@gaudi/design-system/hooks';

const scrollY = useScrollPosition();
const compact = scrollY > 64;
```

## Accessibility

A back-to-top control revealed by scrolling should stay in the tab order (hidden with inert or visibility, not just opacity) and move focus sensibly.

## Notes

- Updates on every scroll event; throttle derived work with useThrottleCallback.

## Examples

- Reading progress in a scroll container (Storybook `hooks-layout-usescrollposition--reading-progress`)
- Page scroll (Storybook `hooks-layout-usescrollposition--page-scroll`)

## Related

`hooks-usethrottlecallback`
