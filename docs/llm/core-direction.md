# Direction

> Core/Direction · core · `@gaudi/design-system/core/Direction`

Scopes text direction for Gaudi controls that need directional keyboard and placement behavior.

## Import

```js
import { DirectionProvider } from '@gaudi/design-system/core/Direction';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `DirectionProvider`, `useDirection`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `dir / direction` | `ltr \| rtl` | `inherited` | no | Direction for descendant controls; direction takes precedence when both are provided. |
| `children` | `ReactNode` | — | no | Controls that consume the direction context. |
| `useDirection(localDirection?)` | `(ltr \| rtl) => ltr \| rtl` | `inherited` | no | Read the local override or nearest provider direction. |

## Usage

```jsx
import { DirectionProvider } from '@gaudi/design-system/core/Direction';

<DirectionProvider dir='rtl'><div dir='rtl'>{controls}</div></DirectionProvider>
```

## Accessibility

Set the same direction on the surrounding DOM so text flow and control behavior agree. Nested providers may override the inherited direction.

## Examples

- Playground (Storybook `core-direction--playground`)
