# Message

One turn in a conversation: an avatar, a header with the sender and time, the content stack and a footer for status such as read or edited. A `MessageGroup` runs several turns from one sender under one avatar.

## Usage

```jsx
import { Bubble, BubbleContent, Message, MessageAvatar, MessageContent, MessageFooter } from '@gaudi/design-system/chat';

<Message align='end'>
  <MessageAvatar><Avatar src={me.src} name={me.name} size='sm' alt='' /></MessageAvatar>
  <MessageContent>
    <Bubble align='end'><BubbleContent>Moving the legend under the axis.</BubbleContent></Bubble>
    <MessageFooter>Read 10:42</MessageFooter>
  </MessageContent>
</Message>
```

## API

| Prop / part | Contract |
| --- | --- |
| `Message` | `align` start or end; the avatar flips with it. |
| `MessageGroup` | Consecutive turns from one sender share an avatar. |
| `MessageAvatar`, `MessageHeader`, `MessageContent`, `MessageFooter` | Avatar column, sender and time, the content stack, and status. |

## Accessibility

Side alone is lost when a thread is read aloud: name the sender in a header or visually hidden text, and label reactions and icon-only actions.
