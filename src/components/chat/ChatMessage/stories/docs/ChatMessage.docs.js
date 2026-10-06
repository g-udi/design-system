import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Chat/ChatMessage": {
    ...definition('One turn in a conversation: avatar, sender and time, the content stack and a status footer.', [p('ChatMessage.align', 'start | end', 'start', 'Side of the conversation; the avatar flips with it.'), p('ChatMessageGroup', 'component', '—', 'Consecutive turns from one sender under one avatar.'), p('ChatMessageAvatar / ChatMessageHeader / ChatMessageContent / ChatMessageFooter', 'components', '—', 'Avatar column, sender and time, content stack and status.'), className], 'Name the sender in a header or visually hidden text; side alone is lost when a thread is read aloud.'),
    usage: "import { ChatBubble, ChatBubbleContent, ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageFooter } from '@gaudi/design-system/chat';\n\n<ChatMessage align='end'>\n  <ChatMessageAvatar><Avatar src={me.src} name={me.name} size='sm' alt='' /></ChatMessageAvatar>\n  <ChatMessageContent>\n    <ChatBubble align='end'><ChatBubbleContent>Moving the legend under the axis.</ChatBubbleContent></ChatBubble>\n    <ChatMessageFooter>Read 10:42</ChatMessageFooter>\n  </ChatMessageContent>\n</ChatMessage>"
  }
};
