# ChatMessage

One turn in a conversation: an avatar, a header with the sender and time, the content stack and a footer for status such as read or edited. A `ChatMessageGroup` runs several turns from one sender under one avatar.

## Usage

```jsx
import { ChatBubble, ChatBubbleContent, ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageFooter } from '@gaudi/design-system/chat';

<ChatMessage align='end'>
  <ChatMessageAvatar><Avatar src={me.src} name={me.name} size='sm' alt='' /></ChatMessageAvatar>
  <ChatMessageContent>
    <ChatBubble align='end'><ChatBubbleContent>Moving the legend under the axis.</ChatBubbleContent></ChatBubble>
    <ChatMessageFooter>Read 10:42</ChatMessageFooter>
  </ChatMessageContent>
</ChatMessage>
```

## API

| Prop / part | Contract |
| --- | --- |
| `ChatMessage` | `align` start or end; the avatar flips with it. |
| `ChatMessageGroup` | Consecutive turns from one sender share an avatar. |
| `ChatMessageAvatar`, `ChatMessageHeader`, `ChatMessageContent`, `ChatMessageFooter` | Avatar column, sender and time, the content stack, and status. |

## Accessibility

Side alone is lost when a thread is read aloud: name the sender in a header or visually hidden text, and label reactions and icon-only actions.
