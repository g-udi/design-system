# useIsomorphicLayoutEffect

> Hooks/State/useIsomorphicLayoutEffect · hooks · `@gaudi/design-system/hooks`

For measure-before-paint code in components that also render on the server. CodeBlock, EventCalendar and Flow use it.

## Import

```js
import { useIsomorphicLayoutEffect } from '@gaudi/design-system/hooks';
```

Exports: `useIsomorphicLayoutEffect`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `effect, deps` | `EffectCallback, DependencyList` | — | no | The same arguments as useLayoutEffect. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `(nothing)` | `void` | Runs the effect. |

## Usage

```jsx
import { useIsomorphicLayoutEffect } from '@gaudi/design-system/hooks';

useIsomorphicLayoutEffect(() => {
  setHeight(ref.current.scrollHeight);
}, [content]);
```

## Accessibility

Measuring before paint avoids visible jumps that can disorient readers and move focus targets.

## Notes

- Prefer useEffect unless you must read layout before the browser paints.

## Examples

- Measure before paint (Storybook `hooks-state-useisomorphiclayouteffect--measure-before-paint`)

## Related

`core-codeblock`, `core-eventcalendar`, `core-flow`
