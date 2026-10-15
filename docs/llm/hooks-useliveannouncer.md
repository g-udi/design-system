# useLiveAnnouncer

> Hooks/A11y/useLiveAnnouncer · hooks · `@gaudi/design-system/hooks`

Announces short messages ("Saved", "3 results", "Copied") through shared visually hidden live regions. The regions exist before the first message so it is not lost, and repeating a message announces it again.

## Import

```js
import { useLiveAnnouncer } from '@gaudi/design-system/hooks';
```

Exports: `useLiveAnnouncer`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.clearAfter` | `number` | `5000` | no | Milliseconds before an announced message is cleared from the region. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `announce(message, politeness)` | `(string, 'polite' \| 'assertive') => void` | Read a message; 'polite' waits, 'assertive' interrupts. |
| `clear()` | `function` | Empty both regions. |

## Usage

```jsx
import { useLiveAnnouncer } from '@gaudi/design-system/hooks';

const { announce } = useLiveAnnouncer();

const save = async () => {
  await saveDraft();
  announce('Draft saved');
};
```

## Accessibility

Use 'polite' for almost everything. Reserve 'assertive' for errors and time-critical changes, keep messages short, and never announce every keystroke or streamed token.

## Notes

- `announce(message, politeness)` is also exported for non-React code.

## Examples

- Polite and assertive messages (Storybook `hooks-a11y-useliveannouncer--save-feedback`)
- Result count after typing settles (Storybook `hooks-a11y-useliveannouncer--result-count`)
