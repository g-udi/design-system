# ChatFeedback

> Chat/ChatFeedback · chat · `@gaudi/design-system/chat/ChatFeedback`

Copy, rate and regenerate a finished reply.

## Import

```js
import ChatFeedback from '@gaudi/design-system/chat/ChatFeedback';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatMessageFeedback`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultRating` | `none \| up \| down` | `none` | no | Initial rating. |
| `regenerate` | `boolean` | `true` | no | Example only: shows Regenerate through onRegenerate. |
| `copyText` | `string` | — | no | What copy writes. |
| `rating` | `'up' \| 'down' \| null` | — | no | Controlled rating. |
| `onRatingChange` | `function` | — | no | Controlled rating. |
| `onCopy / onRegenerate` | `function` | — | no | Host callbacks. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `defaultRating`: `none`, `up`, `down`

## Usage

```jsx
import { ChatMessageFeedback } from '@gaudi/design-system/chat';

<ChatMessageFeedback copyText={reply.text} rating={rating} onRatingChange={setRating} onRegenerate={regenerate} />
```

## Accessibility

A labelled group; ratings are pressed buttons, each action confirmed in a status.

## Examples

- Playground (Storybook `chat-chatfeedback--playground`)
- Rating with a reason (Storybook `chat-chatfeedback--rating-with-a-reason`)

## README

Actions under a finished reply: copy, rate up or down, and regenerate.

### Usage

```jsx
import { ChatMessageFeedback } from '@gaudi/design-system/chat';

<ChatMessageFeedback copyText={reply.text} rating={rating} onRatingChange={setRating} onRegenerate={regenerate} />
```

### API

| Prop / part | Contract |
| --- | --- |
| `copyText` | What the copy action writes. |
| `rating` / `defaultRating` / `onRatingChange` | 'up', 'down' or null. |
| `onCopy` / `onRegenerate` | Host callbacks; `onCopy` runs only after copying succeeds. Regenerate shows only when provided. |
| `labels` | Copy for every label and confirmation, including `copyFailed` when the clipboard is unavailable. |

### Accessibility

A labelled group of icon buttons with tooltips; ratings are pressed buttons, and each action confirms in a visually hidden status.
