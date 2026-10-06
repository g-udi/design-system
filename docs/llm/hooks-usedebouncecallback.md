# useDebounceCallback

> Hooks/State/useDebounceCallback · hooks · `@gaudi/design-system/hooks`

Runs the latest callback once, delay ms after the last call, with the latest arguments: autosave, search requests and resize work. Pending work is cancelled on unmount.

## Import

```js
import { useDebounceCallback } from '@gaudi/design-system/hooks';
```

Exports: `createDebouncer`, `useDebounceCallback`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `callback` | `(...args) => void` | — | no | The work to run. |
| `delay` | `number` | `300` | no | Milliseconds after the last call. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `debounced(...args)` | `function` | Schedule the work. |
| `debounced.cancel / flush / isPending` | `function` | Drop pending work, run it now, or check for it. |

## Usage

```jsx
import { useDebounceCallback } from '@gaudi/design-system/hooks';

const save = useDebounceCallback((text) => saveDraft(text), 800);
<Textarea onChange={(event) => save(event.target.value)} onBlur={save.flush} />
```

## Accessibility

For autosave, show and announce the saved state once the debounced save finishes, and flush on blur so work is not lost.

## Notes

- `createDebouncer(callback, delay)` is exported for non-React code.

## Examples

- Autosave a draft (Storybook `hooks-state-usedebouncecallback--autosave-draft`)
