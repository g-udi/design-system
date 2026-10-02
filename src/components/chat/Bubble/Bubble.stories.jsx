import { expect, within } from 'storybook/test';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { chatMeta } from '../story-helpers.jsx';
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from './index.js';

const variants = ['default', 'secondary', 'muted', 'tinted', 'outline', 'ghost', 'destructive'];

export default {
  title: 'Chat/Bubble',
  id: 'chat-bubble',
  tags: ['autodocs'],
  ...chatMeta('Bubble', { component: Bubble, controls: { variant: variants, align: ['start', 'end'], children: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { variant: 'default', align: 'start', children: 'The newsletter went out at 9:00 to 4,180 readers.' },
  parameters: {
    docs: {
      description: { story: '`variant` picks the surface for the sender or the kind of message, and `align` keeps the bubble and its reactions on the sender side.' },
      source: playgroundSource('Bubble', { imports: "import { Bubble, BubbleContent } from '@gaudi/design-system/chat';", children: '  <BubbleContent>{text}</BubbleContent>' })
    }
  },
  render: ({ children, ...args }) => (
    <div className='mx-auto flex w-full max-w-md flex-col'>
      <BubbleGroup>
        <Bubble {...args}>
          <BubbleContent>{children}</BubbleContent>
          <BubbleReactions align={args.align === 'end' ? 'start' : 'end'}>
            <span role='img' aria-label='3 party popper reactions'>🎉 3</span>
          </BubbleReactions>
        </Bubble>
      </BubbleGroup>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const bubble = within(canvasElement).getByText(args.children).closest('[data-slot="bubble"]');
    await expect(bubble).toHaveAttribute('data-variant', args.variant);
  }
};
