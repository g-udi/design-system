# Message

Parts for chat and conversation views. `Message` lays out one turn (avatar, header, content, footer), `Bubble` is the surface around the text, and `MessageScroller` keeps a long thread anchored while new turns arrive.

## Usage

```jsx
import { Avatar, Bubble, BubbleContent, Message, MessageAvatar, MessageContent, MessageFooter } from '@gaudi/design-system';

<Message align='end'>
  <MessageAvatar><Avatar src={me.src} name={me.name} size='sm' alt='' /></MessageAvatar>
  <MessageContent>
    <Bubble align='end'><BubbleContent>Moving the legend under the axis.</BubbleContent></Bubble>
    <MessageFooter>Read 10:42</MessageFooter>
  </MessageContent>
</Message>
```

## Parts

| Part | Contract |
| --- | --- |
| `Message` / `MessageGroup` | One turn, `align` start or end; a group runs several turns under one avatar. |
| `MessageAvatar`, `MessageHeader`, `MessageContent`, `MessageFooter` | Avatar column, name and time, the content stack, and status such as read or edited. |
| `Bubble` / `BubbleGroup` | `variant` default, secondary, muted, tinted, outline, ghost or destructive; `align` matches the message. |
| `BubbleContent`, `BubbleReactions` | The text (or a button or link with `asChild`) and reactions pinned above or below. |
| `MessageScroller*` | Scroll container with anchoring, auto-scroll to the live edge and a jump button. |

## Accessibility

Side alone is lost when a thread is read aloud: name the sender in a header or visually hidden text, and label reactions and icon-only actions.
