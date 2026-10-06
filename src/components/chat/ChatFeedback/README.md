# ChatFeedback

Actions under a finished reply: copy, rate up or down, and regenerate.

## Usage

```jsx
import { ChatMessageFeedback } from '@gaudi/design-system/chat';

<ChatMessageFeedback copyText={reply.text} rating={rating} onRatingChange={setRating} onRegenerate={regenerate} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `copyText` | What the copy action writes. |
| `rating` / `defaultRating` / `onRatingChange` | 'up', 'down' or null. |
| `onCopy` / `onRegenerate` | Host callbacks; `onCopy` runs only after copying succeeds. Regenerate shows only when provided. |
| `labels` | Copy for every label and confirmation, including `copyFailed` when the clipboard is unavailable. |

## Accessibility

A labelled group of icon buttons with tooltips; ratings are pressed buttons, and each action confirms in a visually hidden status.
