# useScript

> Hooks/Environment/useScript · hooks · `@gaudi/design-system/hooks`

Callers using the same resolved URL share one script. A null source or disabled hook stays idle. No URL is built in, and Storybook uses a local inert fixture. The copied example includes the public file location and contents to create in your app.

## Import

```js
import { useScript } from '@gaudi/design-system/hooks';
```

Exports: `useScript`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string \| null` | — | no | Host-supplied script URL. |
| `options.enabled` | `boolean` | `true` | no | Whether this caller requests the script. |
| `options.removeOnUnmount` | `boolean` | `false` | no | Remove a hook-owned script after its final caller leaves, only if no caller requested retention. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `status` | `'idle' \| 'loading' \| 'ready' \| 'error' \| 'unknown'` | Loading on server for enabled sources; idle for disabled/absent sources. Unknown means a pre-existing script has no observable load status. |

## Usage

```jsx
import { useScript } from '@gaudi/design-system/hooks';

const status = useScript('/scripts/local-preview.js', { enabled: previewOpen });
```

## Accessibility

Provide text for loading/error states and an alternative when an integration is unavailable.

## Notes

- Removing a script tag cannot undo code it already ran. Prefer retaining shared libraries.
- Pre-existing scripts are never removed. Mark known external script state with data-gaudi-script-status="ready" or wait for its load/error event.
- Failed retained scripts stay error; use a new URL or removeOnUnmount to release the failed entry before retrying.

## Examples

- Playground (Storybook `hooks-environment-usescript--playground`)
