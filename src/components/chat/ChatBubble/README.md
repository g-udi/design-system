# ChatBubble

The surface around a message. Seven variants cover who is speaking and what kind of message it is; reactions pin above or below on the sender side.

## Usage

```jsx
import { ChatBubble, ChatBubbleContent, ChatBubbleReactions } from '@gaudi/design-system/chat';

<ChatBubble variant='tinted' align='end'>
  <ChatBubbleContent>Shipped to 4,180 readers.</ChatBubbleContent>
  <ChatBubbleReactions align='start'>🎉 3</ChatBubbleReactions>
</ChatBubble>
```

## API

| Prop / part | Contract |
| --- | --- |
| `variant` | default, secondary, muted, tinted, outline, ghost or destructive. |
| `align` | start or end, matching the message. |
| `ChatBubbleContent` | The text, or a button or link with `asChild`. |
| `ChatBubbleReactions` | Reactions pinned to the bubble edge. |
| `ChatBubbleGroup` | Stacks consecutive bubbles with tighter spacing. |

## Accessibility

Label reactions with `role="img"` and an `aria-label` such as "3 party popper reactions". Bubbles that act as quick replies must be real buttons through `asChild`.
