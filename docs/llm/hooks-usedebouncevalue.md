# useDebounceValue

> Hooks/State/useDebounceValue · hooks · `@gaudi/design-system/hooks`

Delays a fast-changing value, such as a search query, until it has been still for the delay, so filtering and requests do not run on every keystroke.

## Import

```js
import { useDebounceValue } from '@gaudi/design-system/hooks';
```

Exports: `useDebounceValue`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `any` | — | no | The live value. |
| `delay` | `number` | `300` | no | Milliseconds of stillness before updating. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `debouncedValue` | `any` | The settled value. |

## Usage

```jsx
import { useDebounceValue } from '@gaudi/design-system/hooks';

const debouncedQuery = useDebounceValue(query, 300);
const results = useMemo(() => search(debouncedQuery), [debouncedQuery]);
```

## Accessibility

Announce result counts after the debounced update, not per keystroke, so screen readers are not flooded.

## Notes

- Use useDebounceCallback when you need cancel or flush.

## Examples

- Filter after typing settles (Storybook `hooks-state-usedebouncevalue--search-filter`)

## Related

`hooks-usedebouncecallback`
