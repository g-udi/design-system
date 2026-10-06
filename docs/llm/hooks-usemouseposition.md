# useMousePosition

> Hooks/Interaction/useMousePosition · hooks · `@gaudi/design-system/hooks`

Uses pointermove so mouse and pen work together. Updates at most once per animation frame, and cancels pending work when disabled or unmounted. Attach ref to measure local coordinates against an element's bounding rectangle.

## Import

```js
import { useMousePosition } from '@gaudi/design-system/hooks';
```

Exports: `useMousePosition`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.enabled` | `boolean` | `true` | no | Attach tracking listeners; disabling retains the last reading. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `ref` | `callback ref` | Attach to the measured element. |
| `x / y / pageX / pageY` | `number \| null` | Viewport and document coordinates; null before the first move. |
| `elementX / elementY / isInside` | `number \| null / boolean` | Coordinates relative to the bounding rectangle and whether the pointer is inside. |

## Usage

```jsx
import { useMousePosition } from '@gaudi/design-system/hooks';

const { ref, elementX, elementY, isInside } = useMousePosition();
```

## Accessibility

Pointer readouts are supplementary. Keep every action available to keyboard and touch users; do not announce each move.

## Notes

- Touch updates occur only while a pointer is moving. Scrolling alone does not refresh the last sample.
- For an animated cursor use the existing Pointer component.

## Examples

- Playground (Storybook `hooks-interaction-usemouseposition--playground`)

## Related

`core-pointer`
