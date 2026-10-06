import { playgroundSource } from '../../../../docs/components/previewSource.js';
import { Conversation } from './fixtures/Conversation.jsx';
import ConversationSource from './fixtures/Conversation.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';

import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '../../ChatMessage/index.js';

import { ChatAgentMark } from '../../ChatAgentMark/index.js';
import { ChatMessageParts } from '../index.js';

// A conversation is data: each assistant turn is a list of parts, and ChatMessageParts renders them in order.

export default {
  title: 'Chat/ChatMessageList',
  id: 'chat-messagelist',
  tags: ['autodocs'],
  ...chatMeta('ChatMessageList', { component: ChatMessageParts, controls: { streaming: 'boolean', feedback: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { streaming: false, feedback: true },
  parameters: {
    docs: {
      description: { story: 'A thread rendered from data: user turns are bubbles, assistant turns are `parts` (reasoning, a tool call, markdown text and a source) rendered by ChatMessageParts inside the ChatMessageScroller. `streaming` marks the last reply as arriving; `feedback` adds copy and rating under finished replies.' },
      source: playgroundSource('Conversation', { imports: publicSource(ConversationSource, new URL('./fixtures/Conversation.jsx', import.meta.url)) })
    }
  },
  render: (args) => <Conversation {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Which posts kept readers longest last month?')).toBeVisible());
    await expect(canvas.queryAllByRole('group', { name: 'Reply actions' }).length > 0).toBe(args.feedback && !args.streaming);
  }
};

export const FollowUpPrompts = {
  name: 'Reply with follow-up prompts',
  args: { onSuggestion: fn() },
  parameters: { controls: { disable: true }, docs: {
    description: { story: 'Follow-up prompts are an existing ChatMessageParts type. Core Button supplies the controls; the host handles selection. Strings use their label as the prompt, and object items may provide a different prompt plus callback metadata. Starter prompts live in the composed welcome examples under Blocks/Chat.' },
    source: { language: 'jsx', code: "import { useState } from 'react';\nimport { ChatMessageParts } from '@gaudi/design-system/chat';\n\nexport function FollowUpExample() {\n  const [sent, setSent] = useState('');\n  return <div className='grid gap-3'><ChatMessageParts\n  parts={[\n    { type: 'text', text: 'The outline is ready. What would you like to do next?\\n\\n| Section | Status |\\n| --- | --- |\\n| Opening | Ready |\\n| Examples | Ready |' },\n    { type: 'suggestions', items: ['Write a subtitle', { id: 'links', label: 'Check links', prompt: 'Check the draft links.', icon: 'Link' }] }\n  ]}\n  onSuggestion={(prompt, item) => setSent(prompt)}\n/><p role='status'>{sent}</p></div>;\n}" }
  } },
  render: function FollowUps(args) {
    const [picked, setPicked] = useState('');
    return (
      <div className='grid w-full max-w-xl gap-3'>
        <ChatMessage>
          <ChatAgentMark icon='Gaudi' tone='neutral' size='sm' decorative />
          <ChatMessageContent>
            <ChatMessageHeader>Gaudi</ChatMessageHeader>
            <ChatMessageParts parts={[
              { type: 'text', text: 'The outline is ready. What would you like to do next?\n\n| Section | Status |\n| --- | --- |\n| Opening | Ready |\n| Examples | Ready |' },
              { type: 'suggestions', items: ['Write a subtitle', { id: 'links', label: 'Check links', prompt: 'Check the draft links.', icon: 'Link' }] }
            ]} onSuggestion={(prompt, item) => { setPicked(prompt); args.onSuggestion(prompt, item); }} />
          </ChatMessageContent>
        </ChatMessage>
        <p role='status' className='text-sm text-text-muted'>{picked ? `Asked: ${picked}` : ''}</p>
      </div>
    );
  },
  play: async ({ canvasElement, args }) => {
    args.onSuggestion.mockClear();
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: 'Suggested prompts' })).toBeVisible();
    await expect(canvas.getByRole('region', { name: 'Table' })).toHaveAttribute('tabindex', '0');
    await expect(canvas.getByRole('columnheader', { name: 'Section' })).toHaveAttribute('data-slot', 'table-head');
    await userEvent.click(canvas.getByRole('button', { name: 'Write a subtitle' }));
    await expect(args.onSuggestion).toHaveBeenLastCalledWith('Write a subtitle', { id: 'Write a subtitle', label: 'Write a subtitle' });
    await userEvent.click(canvas.getByRole('button', { name: 'Check links' }));
    await expect(args.onSuggestion).toHaveBeenLastCalledWith('Check the draft links.', { id: 'links', label: 'Check links', prompt: 'Check the draft links.', icon: 'Link' });
    await expect(canvas.getByRole('status')).toHaveTextContent('Asked: Check the draft links.');
  }
};
