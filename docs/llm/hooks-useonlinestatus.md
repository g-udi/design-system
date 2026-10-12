# useOnlineStatus

> Hooks/Environment/useOnlineStatus · hooks · `@gaudi/design-system/hooks`

Follows the online and offline events. False is reliable: queue work and say so. True only means 'maybe' (a captive portal reports online), so request errors stay the source of truth.

## Import

```js
import { useOnlineStatus } from '@gaudi/design-system/hooks';
```

Exports: `useOnlineStatus`

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `online` | `boolean` | False when the browser is offline; true during server rendering. |

## Usage

```jsx
import { useOnlineStatus } from '@gaudi/design-system/hooks';

const online = useOnlineStatus();
<Button disabled={!online}>Publish</Button>
```

## Accessibility

Show offline state as text (an Alert or a status region), not only as a colour, and keep entered work.

## Notes

- Do not block reading content offline; disable only the actions that need the network.

## Examples

- Offline notice (Storybook `hooks-environment-useonlinestatus--offline-notice`)
