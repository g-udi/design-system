# ChatBubble

> Chat/ChatBubble · chat · `@gaudi/design-system/chat/ChatBubble`

The surface around a message, with seven variants and reactions.

## Import

```js
import ChatBubble from '@gaudi/design-system/chat/ChatBubble';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatBubble`, `ChatBubbleContent`, `ChatBubbleGroup`, `ChatBubbleReactions`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `default \| secondary \| muted \| tinted \| outline \| ghost \| destructive` | `default` | no | ChatBubble surface. |
| `align` | `start \| end` | `start` | no | Matches the message side. |
| `children` | `string` | — | no | The text, inside ChatBubbleContent. |
| `ChatBubbleReactions.align` | `start \| end` | `end` | no | Edge the reactions pin to. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `variant`: `default`, `secondary`, `muted`, `tinted`, `outline`, `ghost`, `destructive`
- `align`: `start`, `end`

## Usage

```jsx
import { ChatBubble, ChatBubbleContent, ChatBubbleReactions } from '@gaudi/design-system/chat';

<ChatBubble variant='tinted' align='end'>
  <ChatBubbleContent>Shipped to 4,180 readers.</ChatBubbleContent>
  <ChatBubbleReactions align='start'>🎉 3</ChatBubbleReactions>
</ChatBubble>
```

## Accessibility

Label reactions; quick-reply bubbles must be real buttons through asChild.

## Examples

- Playground (Storybook `chat-bubble--playground`)

Curated patterns:

- Suggested replies under a question — registry item `@gaudi/chat-bubble-quick-replies` (uses `Button`, `CardContent`, `CardRoot`, `ChatBubble`, `ChatBubbleContent`, `ChatBubbleGroup`, `RegistryIcon`)
- Bubble styles across a deploy thread — registry item `@gaudi/chat-bubble-release-thread` (uses `ChatBubble`, `ChatBubbleContent`)
- Formatted answer with show more — registry item `@gaudi/chat-bubble-show-more` (uses `Button`, `ChatBubble`, `ChatBubbleContent`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `Link`, `RegistryIcon`)
- Support thread — registry item `@gaudi/chat-bubble-support-thread` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `CardContent`, `CardDescription`, `CardHeader`, `CardRoot`, `CardTitle`, `ChatBubble`, `ChatBubbleContent`, `ChatBubbleGroup`, `ChatBubbleReactions`)

## README

The surface around a message. Seven variants cover who is speaking and what kind of message it is; reactions pin above or below on the sender side.

### Usage

```jsx
import { ChatBubble, ChatBubbleContent, ChatBubbleReactions } from '@gaudi/design-system/chat';

<ChatBubble variant='tinted' align='end'>
  <ChatBubbleContent>Shipped to 4,180 readers.</ChatBubbleContent>
  <ChatBubbleReactions align='start'>🎉 3</ChatBubbleReactions>
</ChatBubble>
```

### API

| Prop / part | Contract |
| --- | --- |
| `variant` | default, secondary, muted, tinted, outline, ghost or destructive. |
| `align` | start or end, matching the message. |
| `ChatBubbleContent` | The text, or a button or link with `asChild`. |
| `ChatBubbleReactions` | Reactions pinned to the bubble edge. |
| `ChatBubbleGroup` | Stacks consecutive bubbles with tighter spacing. |

### Accessibility

Label reactions with `role="img"` and an `aria-label` such as "3 party popper reactions". Bubbles that act as quick replies must be real buttons through `asChild`.
