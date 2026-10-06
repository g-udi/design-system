# useIsMobile

> Hooks/Environment/useIsMobile · hooks · `@gaudi/design-system/hooks`

The breakpoint the AppShell sidebar and DateSelector use to switch to their phone layouts. False during server rendering and hydration.

## Import

```js
import { useIsMobile } from '@gaudi/design-system/hooks';
```

Exports: `MOBILE_BREAKPOINT`, `useIsMobile`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `(none)` | `—` | — | no | Takes no arguments; the breakpoint is MOBILE_BREAKPOINT (768). |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `isMobile` | `boolean` | True when the viewport is narrower than 768px. |

## Usage

```jsx
import { useIsMobile } from '@gaudi/design-system/hooks';

const isMobile = useIsMobile();
return isMobile ? <Drawer>{filters}</Drawer> : <aside>{filters}</aside>;
```

## Accessibility

Switching layouts must not remove features: the phone layout should reach the same actions, often through a Sheet or Drawer.

## Notes

- Built on useMediaQuery; use that directly for other breakpoints.

## Examples

- Sidebar or sheet (Storybook `hooks-environment-useismobile--filters-panel`)

## Related

`blocks-app-shell`, `hooks-usemediaquery`, `core-sheet`
