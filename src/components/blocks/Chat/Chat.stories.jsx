import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Bubble, BubbleContent, Message, MessageContent, MessageHeader, MessageParts, PromptComposer } from '../../core/index.js';
import { ChatPlan, ChatSessionList, ChatShell, ChatWelcome } from './index.js';

const docs = getComponentDocs('Blocks/Chat');
const sessions = [
  { id: 'post', title: 'Local-first drafts post', preview: 'Outline ready', group: 'Today', live: true },
  { id: 'rss', title: 'Fix the RSS feed dates', preview: 'Timezone was dropped', group: 'Yesterday' }
];
const plan = [
  { id: 'outline', title: 'Outline the post', status: 'done' },
  { id: 'draft', title: 'Draft the opening', status: 'running' },
  { id: 'review', title: 'Ask Sarah to review', status: 'pending' }
];
const reply = 'Here is the outline in four beats: the problem, the change, what readers notice and what it cost.';

function ChatPlayground({ variant, title, navigation, details, welcome, streaming }) {
  const [sent, setSent] = useState([]);
  const empty = welcome && !sent.length;
  return (
    <div className={variant === 'sidebar' ? 'h-130 w-full max-w-sm' : 'h-130 w-full'}>
      <ChatShell
        variant={variant}
        title={title}
        navigation={navigation ? <ChatSessionList sessions={sessions} activeId='post' searchable={false} /> : null}
        details={details ? <ChatPlan title='Plan' steps={plan} /> : null}
        composer={<PromptComposer status={streaming ? 'streaming' : 'ready'} onStop={() => {}} onSubmit={(text) => setSent((list) => [...list, text])} labels={{ placeholder: 'Message Gaudi' }} />}
      >
        <div role='region' aria-label='Conversation' tabIndex={0} className='min-h-0 flex-1 overflow-y-auto p-4 focus-visible:outline-none'>
          {empty ? (
            <ChatWelcome title='What are we writing today?' description='Ask Gaudi to plan, edit or check a post.' suggestions={['Plan next week', 'Edit my draft']} onSelect={(text) => setSent([text])} />
          ) : (
            <div className='flex flex-col gap-4'>
              <Message align='end'>
                <MessageContent>
                  <span className='sr-only'>You said</span>
                  <Bubble align='end'><BubbleContent>{sent[0] || 'Outline the local-first drafts post.'}</BubbleContent></Bubble>
                </MessageContent>
              </Message>
              <Message>
                <MessageContent>
                  <MessageHeader className='px-0'>Gaudi</MessageHeader>
                  <MessageParts parts={[{ type: 'text', text: streaming ? reply.slice(0, 48) : reply }]} streaming={streaming} />
                </MessageContent>
              </Message>
              {sent.slice(1).map((text, index) => (
                <Message key={index} align='end'>
                  <MessageContent>
                    <Bubble align='end'><BubbleContent>{text}</BubbleContent></Bubble>
                  </MessageContent>
                </Message>
              ))}
            </div>
          )}
        </div>
      </ChatShell>
    </div>
  );
}

const source = ({ variant, title, navigation, details, streaming }) => `import { ChatPlan, ChatSessionList, ChatShell } from '@gaudi/design-system/blocks/Chat';
import { MessageScroller, PromptComposer } from '@gaudi/design-system';

<ChatShell
  variant='${variant}'
  title='${title}'${navigation ? '\n  navigation={<ChatSessionList sessions={sessions} activeId={activeId} onSelect={setActiveId} />}' : ''}${details ? '\n  details={<ChatPlan steps={plan} />}' : ''}
  composer={<PromptComposer status='${streaming ? 'streaming' : 'ready'}' onSubmit={send} onStop={stop} />}
>
  <MessageScroller>{/* turns */}</MessageScroller>
</ChatShell>`;

export default {
  title: 'Blocks/Chat',
  id: 'blocks-chat',
  component: ChatShell,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    variant: ['page', 'sidebar'],
    title: 'text',
    navigation: 'boolean',
    details: 'boolean',
    welcome: 'boolean',
    streaming: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { variant: 'page', title: 'Local-first drafts post', navigation: true, details: true, welcome: false, streaming: false },
  parameters: {
    docs: {
      description: { story: 'The chat frame: `variant` page lays out navigation, thread and details side by side (they move into Sheets on narrow screens), sidebar is a narrow assistant panel. `navigation` and `details` fill the side columns, `welcome` shows the empty state of a new chat and `streaming` swaps send for stop and queue.' },
      source: { type: 'dynamic', language: 'jsx', transform: (_source, { args }) => source(args) }
    }
  },
  render: (args) => <ChatPlayground {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: args.title })).toBeVisible();
    const prompt = canvas.getByRole('combobox', { name: 'Message' });
    await userEvent.type(prompt, 'Add a closing line{Enter}');
    await waitFor(() => expect(canvas.getByText('Add a closing line')).toBeVisible());
  }
};
