# useHover

> Hooks/Interaction/useHover · hooks · `@gaudi/design-system/hooks`

Tracks pointer hover through onPointerEnter and onPointerLeave. Touch pointers are ignored so a tap does not leave an element stuck in its hover state.

## Import

```js
import { useHover } from '@gaudi/design-system/hooks';
```

Exports: `useHover`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.disabled` | `boolean` | `false` | no | Stop tracking and clear the state. |
| `options.onHoverChange` | `(hovered) => void` | — | no | Called when hover starts or ends. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `isHovered` | `boolean` | Whether a mouse or pen is over the element. |
| `hoverProps` | `{ onPointerEnter, onPointerLeave }` | Spread on the element. |

## Usage

```jsx
import { useHover } from '@gaudi/design-system/hooks';

const { isHovered, hoverProps } = useHover();

<Card {...hoverProps}>{isHovered ? 'Paused' : 'Playing'}</Card>
```

## Accessibility

Hover is an enhancement. Anything revealed on hover must also appear on focus (track :focus-within or onFocus) and be reachable on touch.

## Notes

- Use CSS :hover for purely visual effects; use the hook when hover changes behaviour, such as pausing a carousel.

## Examples

- Pause rotating content (Storybook `hooks-interaction-usehover--pause-on-hover`)
