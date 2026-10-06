# useCounter

> Hooks/State/useCounter · hooks · `@gaudi/design-system/hooks`

Functional updates compose within one event. Reset returns to the current initialValue argument. The hook imposes no product-specific bounds.

## Import

```js
import { useCounter } from '@gaudi/design-system/hooks';
```

Exports: `useCounter`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `initialValue` | `number` | `0` | no | Initial and reset value, also used on the server. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `count` | `number` | Current value. |
| `increment / decrement / reset / setCount` | `function` | Change by one, reset, or assign a number or functional update. |

## Usage

```jsx
import { useCounter } from '@gaudi/design-system/hooks';

const { count, increment, decrement, reset } = useCounter(1);
```

## Accessibility

Give increment and decrement buttons meaningful names; announce changes only when useful.

## Examples

- Playground (Storybook `hooks-state-usecounter--playground`)
