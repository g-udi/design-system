import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Avatar from '../../core/Avatar';
import { Bubble, BubbleContent, BubbleReactions } from '../Bubble/index.js';
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from './index.js';

const docs = getComponentDocs('Chat/Message');
const sarah = { name: 'Sarah Chen', src: 'https://randomuser.me/api/portraits/women/44.jpg' };
const michael = { name: 'Michael Rodriguez', src: 'https://randomuser.me/api/portraits/men/11.jpg' };
const reply = 'Found it: the legend overlaps the last bar. Moving it under the axis.';

const Portrait = ({ person }) => (
  <MessageAvatar>
    <Avatar src={person.src} name={person.name} size='sm' shape='circle' alt='' />
  </MessageAvatar>
);

export default {
  title: 'Chat/Message',
  id: 'chat-message',
  component: Message,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    align: ['start', 'end'],
    variant: ['default', 'secondary', 'muted', 'tinted', 'outline', 'ghost', 'destructive']
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { align: 'end', variant: 'default' },
  parameters: {
    docs: {
      description: { story: 'A short review thread: two messages from Sarah share one avatar in a MessageGroup, and the last reply follows the controls. `align` moves it to either side and `variant` changes its bubble surface.' },
      source: playgroundSource('Message', {
        imports: "import { Avatar } from '@gaudi/design-system';\nimport { Bubble, BubbleContent, BubbleReactions, Message, MessageAvatar, MessageContent, MessageFooter } from '@gaudi/design-system/chat';",
        children: [
          "  <MessageAvatar><Avatar src={person.src} name={person.name} size='sm' alt='' /></MessageAvatar>",
          '  <MessageContent>',
          '    <Bubble variant={variant} align={align}>',
          `      <BubbleContent>${reply}</BubbleContent>`,
          "      <BubbleReactions>👍 2</BubbleReactions>",
          '    </Bubble>',
          '    <MessageFooter>Read 10:42</MessageFooter>',
          '  </MessageContent>'
        ].join('\n')
      })
    }
  },
  render: ({ align, variant }) => (
    <div className='mx-auto flex w-full max-w-md flex-col gap-4'>
      <MessageGroup>
        <Message>
          <MessageAvatar />
          <MessageContent>
            <MessageHeader>{sarah.name} · 10:38</MessageHeader>
            <Bubble variant='muted'>
              <BubbleContent>The quarterly export finished.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message>
          <Portrait person={sarah} />
          <MessageContent>
            <Bubble variant='muted'>
              <BubbleContent>But the chart on page 3 looks off. Can you check it?</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </MessageGroup>
      <Message align={align}>
        <Portrait person={michael} />
        <MessageContent>
          <Bubble variant={variant} align={align}>
            <BubbleContent>{reply}</BubbleContent>
            <BubbleReactions align={align === 'end' ? 'start' : 'end'}>
              <span role='img' aria-label='2 thumbs up reactions'>👍 2</span>
            </BubbleReactions>
          </Bubble>
          <MessageFooter>Read 10:42</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const bubble = within(canvasElement).getByText(reply).closest('[data-slot="bubble"]');
    await expect(bubble).toHaveAttribute('data-variant', args.variant);
    await expect(bubble.closest('[data-slot="message"]')).toHaveAttribute('data-align', args.align);
    await expect(within(canvasElement).getByLabelText('2 thumbs up reactions')).toBeVisible();
  }
};
