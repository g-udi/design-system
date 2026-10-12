# usePageVisibility

> Hooks/Environment/usePageVisibility · hooks · `@gaudi/design-system/hooks`

True while the page is visible. Pause polling, carousels, video and animation loops when the reader switches tabs, and resume when they return.

## Import

```js
import { usePageVisibility } from '@gaudi/design-system/hooks';
```

Exports: `usePageVisibility`

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `visible` | `boolean` | False while the tab is hidden; true during server rendering. |

## Usage

```jsx
import { useInterval, usePageVisibility } from '@gaudi/design-system/hooks';

const visible = usePageVisibility();
useInterval(refresh, visible ? 30000 : null);
```

## Accessibility

Pausing hidden work also stops rotating content from moving on while the reader is away, so they return to what they left.

## Notes

- Combine with useInterval: pass null as the delay while hidden.

## Examples

- Pause polling in the background (Storybook `hooks-environment-usepagevisibility--pause-polling`)

## Related

`hooks-useinterval`
