# ChatMessage

> Chat/ChatMessage · chat · `@gaudi/design-system/chat/ChatMessage`

One turn in a conversation: avatar, sender and time, the content stack and a status footer.

## Import

```js
import ChatMessage from '@gaudi/design-system/chat/ChatMessage';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatMessage`, `ChatMessageAvatar`, `ChatMessageContent`, `ChatMessageFooter`, `ChatMessageGroup`, `ChatMessageHeader`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ChatMessage.align` | `start \| end` | `start` | no | Side of the conversation; the avatar flips with it. |
| `ChatMessageGroup` | `component` | — | no | Consecutive turns from one sender under one avatar. |
| `ChatMessageAvatar / ChatMessageHeader / ChatMessageContent / ChatMessageFooter` | `components` | — | no | Avatar column, sender and time, content stack and status. |
| `className` | `string` | — | no | Additional classes on the outer element. |

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

## Accessibility

Name the sender in a header or visually hidden text; side alone is lost when a thread is read aloud.

## Examples

- Playground (Storybook `chat-message--playground`)
- Failed reply (Storybook `chat-message--failed-reply`)
- Delivered file (Storybook `chat-message--delivered-file`)
- Mixed attachments (Storybook `chat-message--mixed-attachments`)

Curated patterns:

- Error, retry and suggestions — registry item `@gaudi/chat-error-retry-suggestions` (uses `Avatar`, `ChatAgentMark`, `ChatBubble`, `ChatBubbleContent`, `ChatMessage`, `ChatMessageAvatar`, `ChatMessageContent`, `ChatMessageHeader`, `ChatMessageParts`)
- Delivered files and data — registry item `@gaudi/chat-file-delivered-files` (uses `Avatar`, `ChatAgentMark`, `ChatBubble`, `ChatBubbleContent`, `ChatMessage`, `ChatMessageAvatar`, `ChatMessageContent`, `ChatMessageFeedback`, `ChatMessageHeader`, `ChatMessageParts`)
- Assistant reply — registry item `@gaudi/message-assistant-reply` (uses `Button`, `ChatBubble`, `ChatBubbleContent`, `ChatMessage`, `ChatMessageContent`, `ChatMessageFooter`, `Item`, `ItemContent`, `ItemMedia`, `LoaderRoot`, `RegistryIcon`, `useCopyToClipboard`)
- Team conversation — registry item `@gaudi/message-team-conversation` (uses `Attachment`, `AttachmentAction`, `AttachmentActions`, `AttachmentContent`, `AttachmentDescription`, `AttachmentMedia`, `AttachmentTitle`, `AvatarBadge`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `ChatBubble`, `ChatBubbleContent`, `ChatMessage`, `ChatMessageAvatar`, `ChatMessageContent`, `ChatMessageFooter`, `ChatMessageGroup`, `ChatMessageHeader`, `RegistryIcon`)

## Related

`core-avatar`

## README

One turn in a conversation: an avatar, a header with the sender and time, the content stack and a footer for status such as read or edited. A `ChatMessageGroup` runs several turns from one sender under one avatar.

### Usage

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

### API

| Prop / part | Contract |
| --- | --- |
| `ChatMessage` | `align` start or end; the avatar flips with it. |
| `ChatMessageGroup` | Consecutive turns from one sender share an avatar. |
| `ChatMessageAvatar`, `ChatMessageHeader`, `ChatMessageContent`, `ChatMessageFooter` | Avatar column, sender and time, the content stack, and status. |

### Accessibility

Side alone is lost when a thread is read aloud: name the sender in a header or visually hidden text, and label reactions and icon-only actions.
