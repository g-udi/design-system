# useBoolean

> Hooks/State/useBoolean · hooks · `@gaudi/design-system/hooks`

Keeps on/off state without disclosure-specific ARIA. Values and functional updates are normalized to booleans; the initial value is also the server value.

## Import

```js
import { useBoolean } from '@gaudi/design-system/hooks';
```

Exports: `useBoolean`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `initialValue` | `boolean` | `false` | no | Initial on/off value. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `value` | `boolean` | Current state. |
| `setValue / setTrue / setFalse / toggle` | `function` | Set directly or through an updater, enable, disable, or invert the value. |

## Usage

```jsx
import { useBoolean } from '@gaudi/design-system/hooks';

const { value, toggle, setTrue, setFalse } = useBoolean(false);
```

## Accessibility

Use aria-pressed on toggle buttons or checked on switches. Use useDisclosure for a control that reveals a region.

## Notes

- Covers the boolean useToggle use case with one API.

## Examples

- Playground (Storybook `hooks-state-useboolean--playground`)

## Related

`hooks-usedisclosure`
