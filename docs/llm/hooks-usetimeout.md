# useTimeout

> Hooks/State/useTimeout · hooks · `@gaudi/design-system/hooks`

Calls the callback once, delay ms after mount or after the delay changes. Pass null to hold it; reset restarts it and clear cancels it.

## Import

```js
import { useTimeout } from '@gaudi/design-system/hooks';
```

Exports: `useTimeout`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `callback` | `() => void` | — | no | Called when the timer fires. |
| `delay` | `number \| null` | — | no | Milliseconds; null holds the timer. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `reset / clear` | `() => void` | Restart or cancel the timer. |

## Usage

```jsx
import { useTimeout } from '@gaudi/design-system/hooks';

const { clear, reset } = useTimeout(() => setVisible(false), visible ? 5000 : null);
```

## Accessibility

Auto-dismissed messages must stay long enough to read, pause while hovered or focused, and stay available elsewhere (WCAG 2.2.1).

## Notes

- Clear on hover and focus, reset on leave and blur, for dismissible notices.

## Examples

- Auto-dismiss that pauses (Storybook `hooks-state-usetimeout--auto-dismiss`)
