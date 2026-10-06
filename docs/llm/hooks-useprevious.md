# usePrevious

> Hooks/State/usePrevious · hooks · `@gaudi/design-system/hooks`

For "went up / went down" indicators, transition direction and change detection. Tracked in state, so it is safe under concurrent rendering, and unchanged re-renders keep the same previous value.

## Import

```js
import { usePrevious } from '@gaudi/design-system/hooks';
```

Exports: `usePrevious`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `any` | — | no | The value to track. |
| `initial` | `any` | `undefined` | no | Returned until the value first changes. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `previous` | `any` | The value before the last change. |

## Usage

```jsx
import { usePrevious } from '@gaudi/design-system/hooks';

const previous = usePrevious(count);
const trend = previous === undefined ? 'flat' : count > previous ? 'up' : 'down';
```

## Accessibility

When a change direction is shown with colour or an arrow, also state it in text ("up 12%").

## Notes

- Comparison uses Object.is; pass primitives or stable objects.

## Examples

- Change since the last value (Storybook `hooks-state-useprevious--trend`)
