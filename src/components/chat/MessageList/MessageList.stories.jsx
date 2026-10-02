import { expect, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { Bubble, BubbleContent } from '../Bubble/index.js';
import { Message, MessageContent, MessageHeader } from '../Message/index.js';
import { MessageFeedback } from '../ChatFeedback/index.js';
import { AgentMark } from '../AgentMark/index.js';
import { MessageParts, MessageScroller, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from './index.js';

// A conversation is data: each assistant turn is a list of parts, and MessageParts renders them in order.
const conversation = [
  { id: 'q1', role: 'user', text: 'Which posts kept readers longest last month?' },
  {
    id: 'a1',
    role: 'assistant',
    parts: [
      { type: 'reasoning', duration: 4, steps: [{ text: 'Read September reading-time data', status: 'done' }, { text: 'Rank posts by median time on page', status: 'done' }] },
      { type: 'tool', name: 'reading_stats', status: 'done', input: { month: '2026-09' }, output: { posts: 14, medianMinutes: 6.2 } },
      { type: 'text', text: 'Three posts held readers past **eight minutes** [1]:\n\n1. *Local-first drafts*: 11 min\n2. *Designing for real data*: 9 min\n3. *Small tools, long lifetimes*: 8 min\n\nAll three open with a working example before any theory.' },
      { type: 'source', title: 'Reading time report, September', url: 'https://example.com/reports/september', site: 'Analytics' }
    ]
  },
  { id: 'q2', role: 'user', text: 'Draft a teaser for the top one.' }
];

function Conversation({ streaming, feedback }) {
  const lastAssistant = conversation.filter((turn) => turn.role === 'assistant').at(-1);
  return (
    <MessageScrollerProvider>
      <MessageScroller className='h-120 w-full max-w-2xl rounded-(--ds-radius-card) border'>
        <MessageScrollerViewport>
          <MessageScrollerContent className='p-4'>
            {conversation.map((turn) => (
              <MessageScrollerItem key={turn.id} scrollAnchor={turn.role === 'user'}>
                {turn.role === 'user' ? (
                  <Message align='end'>
                    <MessageContent>
                      <span className='sr-only'>You said</span>
                      <Bubble align='end'><BubbleContent>{turn.text}</BubbleContent></Bubble>
                    </MessageContent>
                  </Message>
                ) : (
                  <Message>
                    <AgentMark size='sm' decorative className='mt-0.5' />
                    <MessageContent>
                      <MessageHeader className='px-0'>Gaudi</MessageHeader>
                      <MessageParts parts={turn.parts} streaming={streaming && turn === lastAssistant} />
                      {feedback && !(streaming && turn === lastAssistant) ? <MessageFeedback copyText='Three posts held readers past eight minutes.' /> : null}
                    </MessageContent>
                  </Message>
                )}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  );
}

export default {
  title: 'Chat/MessageList',
  id: 'chat-messagelist',
  tags: ['autodocs'],
  ...chatMeta('MessageList', { component: MessageParts, controls: { streaming: 'boolean', feedback: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { streaming: false, feedback: true },
  parameters: {
    docs: {
      description: { story: 'A thread rendered from data: user turns are bubbles, assistant turns are `parts` (reasoning, a tool call, markdown text and a source) rendered by MessageParts inside the MessageScroller. `streaming` marks the last reply as arriving; `feedback` adds copy and rating under finished replies.' },
      source: {
        language: 'jsx',
        code: `import { AgentMark, Bubble, BubbleContent, Message, MessageContent, MessageFeedback, MessageParts, MessageScroller, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '@gaudi/design-system/chat';

<MessageScrollerProvider>
  <MessageScroller>
    <MessageScrollerViewport>
      <MessageScrollerContent>
        {turns.map((turn) => (
          <MessageScrollerItem key={turn.id} scrollAnchor={turn.role === 'user'}>
            {turn.role === 'user'
              ? <Message align='end'><MessageContent><Bubble align='end'><BubbleContent>{turn.text}</BubbleContent></Bubble></MessageContent></Message>
              : <Message><AgentMark size='sm' decorative /><MessageContent><MessageParts parts={turn.parts} streaming={turn.streaming} /><MessageFeedback copyText={turn.text} /></MessageContent></Message>}
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
  </MessageScroller>
</MessageScrollerProvider>`
      }
    }
  },
  render: (args) => <Conversation {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Which posts kept readers longest last month?')).toBeVisible();
    await expect(canvas.queryAllByRole('group', { name: 'Reply actions' }).length > 0).toBe(args.feedback && !args.streaming);
  }
};
