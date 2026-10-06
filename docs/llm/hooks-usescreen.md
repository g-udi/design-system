# useScreen

> Hooks/Environment/useScreen · hooks · `@gaudi/design-system/hooks`

Measures after mount and refreshes on window resize and screen-orientation changes. Returns a plain snapshot instead of the browser's mutable Screen object.

## Import

```js
import { useScreen } from '@gaudi/design-system/hooks';
```

Exports: `useScreen`

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `screen` | `object \| undefined` | Undefined on the server. Includes width, height, availWidth, availHeight, colorDepth, pixelDepth, orientation and angle. |

## Usage

```jsx
import { useScreen } from '@gaudi/design-system/hooks';

const screen = useScreen();
```

## Accessibility

Use viewport or container size for responsive layout; display size does not describe the space available to your component.

## Notes

- Dimensions are screen CSS pixels and may be reduced or rounded by browser privacy settings. Orientation and angle are null when unavailable.

## Examples

- Playground (Storybook `hooks-environment-usescreen--playground`)
