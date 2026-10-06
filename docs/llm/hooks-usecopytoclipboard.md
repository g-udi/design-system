# useCopyToClipboard

> Hooks/Interaction/useCopyToClipboard · hooks · `@gaudi/design-system/hooks`

Writes text with the Clipboard API and falls back to a hidden textarea (restoring focus and selection) where the API is blocked. isCopied resets after the timeout. Merges two earlier implementations: copyToClipboard and copy are the same function.

## Import

```js
import { useCopyToClipboard } from '@gaudi/design-system/hooks';
```

Exports: `useCopyToClipboard`, `writeToClipboard`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.timeout` | `number` | `2000` | no | Milliseconds before isCopied resets; 0 keeps it. A number may be passed instead of the options. |
| `options.onCopy / onError` | `(text) => void` | — | no | Called after a successful or failed copy. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `copy(text) / copyToClipboard(text)` | `(text) => Promise<boolean>` | Copy; resolves to whether it worked. |
| `isCopied / copiedText` | `boolean / string \| null` | Feedback state. |
| `reset()` | `function` | Clear the copied state now. |

## Usage

```jsx
import { useCopyToClipboard } from '@gaudi/design-system/hooks';

const { copy, isCopied } = useCopyToClipboard();

<Button onClick={() => copy(url)}>{isCopied ? 'Copied' : 'Copy link'}</Button>
```

## Accessibility

Keep the button name stable ("Copy link") and announce the result in a polite status region; swapping only the icon is not announced.

## Notes

- CodeBlock already has a copy button; use this hook for custom copy actions.

## Examples

- Copy a share link (Storybook `hooks-interaction-usecopytoclipboard--share-field`)
- One hook, several copy buttons (Storybook `hooks-interaction-usecopytoclipboard--several-targets`)
- Reset pending feedback (Storybook `hooks-interaction-usecopytoclipboard--reset-pending-copy`)

## Related

`core-codeblock`
