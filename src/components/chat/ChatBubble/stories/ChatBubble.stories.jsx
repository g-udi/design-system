import { previewSource } from '../../../../docs/components/previewSource.js';
import { expect, within } from 'storybook/test';

import { chatMeta } from '../../stories/story-helpers.jsx';
import { ChatBubble, ChatBubbleContent, ChatBubbleGroup, ChatBubbleReactions } from '../index.js';

const variants = ['default', 'secondary', 'muted', 'tinted', 'outline', 'ghost', 'destructive'];

export default {
  title: 'Chat/ChatBubble',
  id: 'chat-bubble',
  tags: ['autodocs'],
  ...chatMeta('ChatBubble', { component: ChatBubble, controls: { variant: variants, align: ['start', 'end'], children: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { variant: 'default', align: 'start', children: 'The newsletter went out at 9:00 to 4,180 readers.' },
  parameters: {
    docs: {
      description: { story: '`variant` picks the surface for the sender or the kind of message, and `align` keeps the bubble and its reactions on the sender side.' },
      source: { type: 'code', language: 'jsx', transform: (_source, { args }) => previewSource('ChatBubble', args, { imports: "import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat';", children: '  <ChatBubbleContent>{' + JSON.stringify(args.children) + '}</ChatBubbleContent>' }) }
    }
  },
  render: ({ children, ...args }) => (
    <div className='mx-auto flex w-full max-w-md flex-col'>
      <ChatBubbleGroup>
        <ChatBubble {...args}>
          <ChatBubbleContent>{children}</ChatBubbleContent>
          <ChatBubbleReactions align={args.align === 'end' ? 'start' : 'end'}>
            <span role='img' aria-label='3 party popper reactions'>🎉 3</span>
          </ChatBubbleReactions>
        </ChatBubble>
      </ChatBubbleGroup>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const bubble = within(canvasElement).getByText(args.children).closest('[data-slot="bubble"]');
    await expect(bubble).toHaveAttribute('data-variant', args.variant);
  }
};
