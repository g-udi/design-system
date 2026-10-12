# useHotkey

> Hooks/Interaction/useHotkey · hooks · `@gaudi/design-system/hooks`

Runs a callback for a combination such as 'mod+k' (Command+K on macOS, Control+K elsewhere), 'shift+?' or 'escape'. Skips plain keys while the reader types in a field, and returns aria-keyshortcuts and Kbd keys for the hint.

## Import

```js
import { useHotkey } from '@gaudi/design-system/hooks';
```

Exports: `isApplePlatform`, `matchHotkey`, `parseHotkey`, `toAriaKeyShortcuts`, `toKbdKeys`, `useHotkey`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `keys` | `string \| string[]` | — | no | One or more combinations: 'mod+k', 'ctrl+shift+p', '/', 'escape'. |
| `callback` | `(event, combo) => void` | — | no | Called when a combination matches. |
| `options.enabled` | `boolean` | `true` | no | When and where to listen. |
| `target` | `target` | `'document'` | no | When and where to listen. |
| `event` | `'keydown' \| 'keyup'` | `'keydown'` | no | When and where to listen. |
| `options.preventDefault` | `boolean` | `true` | no | Stop the browser default for a matched shortcut. |
| `options.enableInInputs / allowRepeat` | `boolean` | `false` | no | Also fire in text fields, and on held-key repeats. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `ariaKeyShortcuts` | `string` | Value for aria-keyshortcuts, e.g. 'Meta+K Control+K'. |
| `kbdKeys` | `string` | Keys for Kbd, e.g. 'command,k' on macOS and 'ctrl,k' elsewhere. |

## Usage

```jsx
import { useHotkey } from '@gaudi/design-system/hooks';

const { ariaKeyShortcuts, kbdKeys } = useHotkey('mod+k', () => setOpen(true));

<Button aria-keyshortcuts={ariaKeyShortcuts} onClick={() => setOpen(true)}>Search <Kbd keys={kbdKeys} /></Button>
```

## Accessibility

Every shortcut needs a visible control that does the same thing. Put aria-keyshortcuts on that control and show the keys with Kbd. Avoid single-key shortcuts unless they can be turned off (WCAG 2.1.4).

## Notes

- `parseHotkey`, `matchHotkey`, `toAriaKeyShortcuts` and `toKbdKeys` are exported for custom handling.

## Examples

- Platform-aware mod key (Storybook `hooks-interaction-usehotkey--command-palette`)
- Single-key shortcuts that can be turned off (Storybook `hooks-interaction-usehotkey--single-keys`)

## Related

`core-kbd`
