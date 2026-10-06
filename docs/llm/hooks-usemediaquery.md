# useMediaQuery

> Hooks/Environment/useMediaQuery · hooks · `@gaudi/design-system/hooks`

Returns whether a media query matches and follows changes. Returns the fallback during server rendering and hydration so markup stays stable; client-only renders read the real value at once. Merges two earlier implementations.

## Import

```js
import { useMediaQuery } from '@gaudi/design-system/hooks';
```

Exports: `matchesMediaQuery`, `subscribeMediaQuery`, `useMediaQuery`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `query` | `string` | — | no | A media query such as '(min-width: 1024px)'. |
| `fallback` | `boolean` | `false` | no | Value during server rendering and hydration. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `matches` | `boolean` | Whether the query matches. |

## Usage

```jsx
import { useMediaQuery } from '@gaudi/design-system/hooks';

const wide = useMediaQuery('(min-width: 1024px)', true);
```

## Accessibility

Prefer CSS for purely visual changes. Use the hook when the tree really differs (one pane instead of two), and keep the same content and controls reachable in both layouts.

## Notes

- `matchesMediaQuery(query)` and `subscribeMediaQuery(query, notify)` are exported for non-React code.

## Examples

- Live queries (Storybook `hooks-environment-usemediaquery--queries`)
- Render a different tree (Storybook `hooks-environment-usemediaquery--different-tree`)
