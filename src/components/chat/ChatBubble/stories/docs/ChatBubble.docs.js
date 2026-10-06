import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Chat/ChatBubble": {
    ...definition('The surface around a message, with seven variants and reactions.', [p('variant', 'default | secondary | muted | tinted | outline | ghost | destructive', 'default', 'ChatBubble surface.'), p('align', 'start | end', 'start', 'Matches the message side.'), p('children', 'string', '—', 'The text, inside ChatBubbleContent.'), p('ChatBubbleReactions.align', 'start | end', 'end', 'Edge the reactions pin to.'), className], 'Label reactions; quick-reply bubbles must be real buttons through asChild.'),
    usage: "import { ChatBubble, ChatBubbleContent, ChatBubbleReactions } from '@gaudi/design-system/chat';\n\n<ChatBubble variant='tinted' align='end'>\n  <ChatBubbleContent>Shipped to 4,180 readers.</ChatBubbleContent>\n  <ChatBubbleReactions align='start'>🎉 3</ChatBubbleReactions>\n</ChatBubble>"
  }
};
