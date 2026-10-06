# useMergedRefs

> Hooks/State/useMergedRefs · hooks · `@gaudi/design-system/hooks`

One stable callback ref that forwards the node to every ref passed, object or callback, including React 19 ref cleanups.

## Import

```js
import { useMergedRefs } from '@gaudi/design-system/hooks';
```

Exports: `assignRef`, `mergeRefs`, `useMergedRefs`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `...refs` | `Ref[]` | — | no | Object refs, callback refs or undefined. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `ref` | `(node) => void` | Callback ref to attach. |

## Usage

```jsx
import { useMergedRefs } from '@gaudi/design-system/hooks';

function SearchField({ ref, ...props }) {
  const inputRef = useRef(null);
  return <Input ref={useMergedRefs(ref, inputRef)} {...props} />;
}
```

## Accessibility

Lets a component keep its own ref for focus management while still forwarding the host ref.

## Notes

- `mergeRefs(...refs)` is exported for use outside components.

## Examples

- Forward a ref and keep your own (Storybook `hooks-state-usemergedrefs--forwarded-and-own-ref`)
