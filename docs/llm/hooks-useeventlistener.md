# useEventListener

> Hooks/Interaction/useEventListener · hooks · `@gaudi/design-system/hooks`

Attaches a listener to window (default), document, an element or a ref, and removes it on unmount. The latest handler always runs without re-subscribing, and refs are re-read after every commit so the listener follows conditional elements.

## Import

```js
import { useEventListener } from '@gaudi/design-system/hooks';
```

Exports: `useEventListener`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eventName` | `string` | — | no | DOM event such as 'keydown', 'scroll' or 'resize'. |
| `handler` | `(event) => void` | — | no | Called for each event; may change on every render. |
| `target` | `'window' \| 'document' \| Element \| RefObject \| null` | `'window'` | no | Where to listen; null detaches. |
| `options` | `boolean \| AddEventListenerOptions` | — | no | capture, passive, once and signal. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `(nothing)` | `void` | The listener lives as long as the component. |

## Usage

```jsx
import { useEventListener } from '@gaudi/design-system/hooks';

useEventListener('resize', () => setWidth(window.innerWidth));
useEventListener('scroll', onScroll, panelRef, { passive: true });
```

## Accessibility

Keyboard listeners on window or document must not swallow keys that belong to focused controls; check event.target and event.defaultPrevented.

## Notes

- Mark scroll and touch listeners passive so they never delay scrolling.

## Examples

- Window events (Storybook `hooks-interaction-useeventlistener--window-events`)
- Document events (Storybook `hooks-interaction-useeventlistener--document-events`)
- An element through a ref (Storybook `hooks-interaction-useeventlistener--element-ref`)
