import { expect, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { MessageTool } from '../ChatTool/index.js';
import { MessageDelegation } from './index.js';

export default {
  title: 'Chat/ChatDelegation',
  id: 'chat-chatdelegation',
  tags: ['autodocs'],
  ...chatMeta('ChatDelegation', { component: MessageDelegation, controls: { status: ['pending', 'running', 'done', 'failed'], instructions: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { status: 'running', instructions: 'Find three studies on article drop-off published since 2023 and summarise each in one line.' },
  parameters: {
    docs: {
      description: { story: 'Work Gaudi handed to another agent: who took it, the brief and its `status`. Children carry that agent’s own activity, such as its tool calls.' },
      source: {
        language: 'jsx',
        code: `import { MessageDelegation, MessageTool } from '@gaudi/design-system/chat';

<MessageDelegation agent={{ name: 'Research agent' }} status={status} instructions={brief}>
  <MessageTool name='web_search' status='done' />
</MessageDelegation>`
      }
    }
  },
  render: ({ status, instructions }) => (
    <div className='w-full max-w-xl'>
      <MessageDelegation
        agent={{ name: 'Research agent' }}
        status={status}
        instructions={instructions}
        error={status === 'failed' ? 'The research agent could not reach the journal archive.' : undefined}
      >
        <MessageTool name='web_search' status={status === 'pending' ? 'pending' : 'done'} input={{ query: 'article drop-off reading study 2023' }} />
        <MessageTool name='read_page' status={status === 'done' ? 'done' : status === 'failed' ? 'failed' : 'running'} />
      </MessageDelegation>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="message-delegation"]')).toHaveAttribute('data-status', args.status);
    await expect(within(canvasElement).getByText('Research agent')).toBeVisible();
  }
};
