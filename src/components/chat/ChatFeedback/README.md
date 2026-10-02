# ChatFeedback

Actions under a finished reply: copy, rate up or down, and regenerate.

## Usage

```jsx
import { MessageFeedback } from '@gaudi/design-system/chat';

<MessageFeedback copyText={reply.text} rating={rating} onRatingChange={setRating} onRegenerate={regenerate} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `copyText` | What the copy action writes. |
| `rating` / `defaultRating` / `onRatingChange` | 'up', 'down' or null. |
| `onCopy` / `onRegenerate` | Host callbacks; regenerate shows only when provided. |
| `labels` | Copy for every label and confirmation. |

## Accessibility

A labelled group of icon buttons with tooltips; ratings are pressed buttons, and each action confirms in a visually hidden status.
