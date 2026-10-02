import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { MessageCitation, MessageSources } from './index.js';

const sources = [
  { title: 'Where readers leave an article', url: 'https://example.com/research/drop-off', site: 'Reading Lab', excerpt: 'Most readers who leave do so in the first 15% of the page.' },
  { title: 'Reading time report, September', url: 'https://example.com/reports/september', site: 'Analytics', kind: 'document' },
  { title: 'Local-first drafts', url: 'https://example.com/posts/local-first-drafts', site: 'The blog' }
];

export default {
  title: 'Chat/ChatSources',
  id: 'chat-chatsources',
  tags: ['autodocs'],
  ...chatMeta('ChatSources', { component: MessageSources, controls: { label: 'text', defaultOpen: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { label: '3 sources', defaultOpen: false },
  parameters: {
    docs: {
      description: { story: 'Where an answer came from. The sentence cites a source with a numbered MessageCitation that opens a popover; MessageSources lists them all under the reply with the same numbers.' },
      source: {
        language: 'jsx',
        code: `import { MessageCitation, MessageSources } from '@gaudi/design-system/chat';

<p>Readers leave early <MessageCitation index={1} source={sources[0]} /> on long posts.</p>
<MessageSources sources={sources} />`
      }
    }
  },
  render: ({ label, defaultOpen }) => (
    <div className='grid w-full max-w-xl gap-3 text-sm'>
      <p>
        Most readers who leave do so in the first screen <MessageCitation index={1} source={sources[0]} />, and the posts that hold them open with a working example <MessageCitation index={2} source={sources[1]} />.
      </p>
      <MessageSources key={`${defaultOpen}`} sources={sources} label={label} defaultOpen={defaultOpen} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: new RegExp(args.label) });
    if (!args.defaultOpen) await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByRole('link', { name: /Local-first drafts/ })).toBeVisible());
  }
};
