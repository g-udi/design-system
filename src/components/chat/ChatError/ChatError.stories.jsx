import { expect, fn, userEvent, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { MessageError } from './index.js';

export default {
  title: 'Chat/ChatError',
  id: 'chat-chaterror',
  tags: ['autodocs'],
  ...chatMeta('ChatError', { component: MessageError, controls: { title: 'text', retryLabel: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'The reply stopped before it finished.', retryLabel: 'Try again', onRetry: fn() },
  argTypes: { onRetry: { table: { disable: true } } },
  parameters: {
    docs: {
      description: { story: 'A turn that failed, as an alert in the thread: what went wrong, a short hint and a retry. The rest of the conversation stays usable.' },
      source: {
        language: 'jsx',
        code: `import { MessageError } from '@gaudi/design-system/chat';

<MessageError title='The reply stopped before it finished.' onRetry={retry}>
  The connection dropped after 40 seconds. Your message is kept.
</MessageError>`
      }
    }
  },
  render: (args) => (
    <div className='w-full max-w-xl'>
      <MessageError {...args}>The connection dropped after 40 seconds. Your message is kept.</MessageError>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent(args.title);
    await userEvent.click(canvas.getByRole('button', { name: args.retryLabel }));
    await expect(args.onRetry).toHaveBeenCalled();
  }
};
