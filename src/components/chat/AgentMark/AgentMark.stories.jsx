import { expect, within } from 'storybook/test';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { chatMeta } from '../story-helpers.jsx';
import { Message, MessageContent, MessageHeader } from '../Message/index.js';
import { AgentMark } from './index.js';

export default {
  title: 'Chat/AgentMark',
  id: 'chat-agentmark',
  tags: ['autodocs'],
  ...chatMeta('AgentMark', {
    component: AgentMark,
    controls: { name: 'text', size: ['xs', 'sm', 'md', 'lg'], tone: ['accent', 'discovery', 'neutral', 'solid'], state: ['idle', 'thinking', 'streaming', 'tool', 'done', 'error'], monogram: 'boolean' },
    primary: () => Playground
  })
};

export const Playground = {
  args: { name: 'Gaudi', size: 'lg', tone: 'accent', state: 'thinking', monogram: false },
  parameters: {
    docs: {
      description: { story: 'The assistant’s mark: an icon, an image or a monogram on a token-coloured tile that follows the global radius. `state` adds an ActivityIndicator badge at the corner, so the mark also says what the assistant is doing.' },
      source: playgroundSource('AgentMark', { imports: "import { AgentMark } from '@gaudi/design-system/chat';" })
    }
  },
  render: (args) => <AgentMark {...args} />,
  play: async ({ args, canvasElement }) => {
    const mark = within(canvasElement).getByRole('img', { name: args.name });
    await expect(mark).toHaveAttribute('data-slot', 'agent-mark');
  }
};

export const InAThread = {
  name: 'In a thread, with several agents',
  parameters: { docs: { description: { story: 'Marks tell agents apart in one conversation. The visible name sits beside each mark, so the marks are decorative here and the header names the sender.' } } },
  render: () => (
    <div className='flex w-full max-w-lg flex-col gap-4 text-sm'>
      <Message>
        <AgentMark size='sm' decorative state='done' />
        <MessageContent>
          <MessageHeader className='px-0'>Gaudi</MessageHeader>
          <p>I asked the Research agent for recent drop-off studies.</p>
        </MessageContent>
      </Message>
      <Message>
        <AgentMark name='Research agent' icon='Search' tone='discovery' size='sm' decorative state='streaming' />
        <MessageContent>
          <MessageHeader className='px-0'>Research agent</MessageHeader>
          <p>Reading three papers from 2024 and one archive report…</p>
        </MessageContent>
      </Message>
      <Message>
        <AgentMark name='Fact checker' monogram tone='neutral' size='sm' decorative state='error' />
        <MessageContent>
          <MessageHeader className='px-0'>Fact checker</MessageHeader>
          <p>Couldn’t open the 2023 survey; it needs a login.</p>
        </MessageContent>
      </Message>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Research agent', { selector: '[data-slot="message-header"]' })).toBeVisible();
  }
};
