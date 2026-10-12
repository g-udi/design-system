# useWindowSize

> Hooks/Environment/useWindowSize · hooks · `@gaudi/design-system/hooks`

Reads the window after mount and updates on resize. Unchanged dimensions keep the same result object. The server and first client render use the supplied initial dimensions.

## Import

```js
import { useWindowSize } from '@gaudi/design-system/hooks';
```

Exports: `useWindowSize`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.initialWidth` | `number` | `0` | no | Deterministic dimensions before the first client measurement. |
| `initialHeight` | `number` | `0` | no | Deterministic dimensions before the first client measurement. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `size` | `{ width, height }` | Layout viewport dimensions, not device screen or visual viewport dimensions. |

## Usage

```jsx
import { useWindowSize } from '@gaudi/design-system/hooks';

const { width, height } = useWindowSize();
```

## Accessibility

Prefer CSS responsive layout or useMediaQuery for breakpoints. Avoid hiding essential content based only on viewport size.

## Examples

- Playground (Storybook `hooks-environment-usewindowsize--playground`)

## Related

`hooks-usemediaquery`
