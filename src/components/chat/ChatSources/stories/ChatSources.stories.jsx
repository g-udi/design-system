import { previewSource } from '../../../../docs/components/previewSource.js';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { ChatMessageCitation, ChatMessageSources } from '../index.js';

const sources = [
  { title: 'Where readers leave an article', url: 'https://example.com/research/drop-off', site: 'Reading Lab', excerpt: 'Most readers who leave do so in the first 15% of the page.' },
  { title: 'Reading time report, September', url: 'https://example.com/reports/september', site: 'Analytics', kind: 'document' },
  { title: 'Local-first drafts', url: 'https://example.com/posts/local-first-drafts', site: 'The blog' }
];

export default {
  title: 'Chat/ChatSources',
  id: 'chat-chatsources',
  tags: ['autodocs'],
  ...chatMeta('ChatSources', { component: ChatMessageSources, controls: { label: 'text', defaultOpen: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { label: '3 sources', defaultOpen: false },
  parameters: {
    docs: {
      description: { story: 'Where an answer came from. The sentence cites a source with a numbered ChatMessageCitation that opens a popover; ChatMessageSources lists them all under the reply with the same numbers.' },
      source: { type: 'dynamic', language: 'jsx', transform: (_source, { args }) => previewSource('ChatMessageSources', args, { imports: "import { ChatMessageCitation, ChatMessageSources } from '@gaudi/design-system/chat';\n\nconst sources = " + JSON.stringify(sources, null, 2) + ';', before: "<>\n<p>Readers leave early <ChatMessageCitation index={1} source={sources[0]} /> on long posts.</p>\n", attributes: ['sources={sources}'], after: '\n</>' }) }
    }
  },
  render: ({ label, defaultOpen }) => (
    <div className='grid w-full max-w-xl gap-3 text-sm'>
      <p>
        Most readers who leave do so in the first screen <ChatMessageCitation index={1} source={sources[0]} />, and the posts that hold them open with a working example <ChatMessageCitation index={2} source={sources[1]} />.
      </p>
      <ChatMessageSources key={`${defaultOpen}`} sources={sources} label={label} defaultOpen={defaultOpen} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: new RegExp(args.label) });
    if (!args.defaultOpen) await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByRole('link', { name: /Local-first drafts/ })).toBeVisible());
  }
};
