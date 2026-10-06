# usePrefersColorScheme

> Hooks/Environment/usePrefersColorScheme · hooks · `@gaudi/design-system/hooks`

Follows the system preference live. This is not the site theme: read the active theme from the theme provider, and use this hook for system-default choices such as an embed or a chart palette.

## Import

```js
import { usePrefersColorScheme } from '@gaudi/design-system/hooks';
```

Exports: `usePrefersColorScheme`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `fallback` | `'light' \| 'dark'` | `'light'` | no | Value during server rendering and hydration. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `scheme` | `'light' \| 'dark'` | The system preference. |

## Usage

```jsx
import { usePrefersColorScheme } from '@gaudi/design-system/hooks';

const scheme = usePrefersColorScheme();
```

## Accessibility

Both schemes must meet contrast requirements; use Gaudi tokens, which resolve per theme.

## Notes

- Built on useMediaQuery.

## Examples

- System default for an embed (Storybook `hooks-environment-usepreferscolorscheme--system-default`)

## Related

`hooks-usemediaquery`
