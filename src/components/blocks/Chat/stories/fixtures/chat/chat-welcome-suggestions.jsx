'use client';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { useState } from 'react';
import { ChatShell } from '@gaudi/design-system/blocks/Chat';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageParts } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const suggestions = [
  { id: 'ideas', label: 'Ideas for next week’s post', icon: 'Lightbulb' },
  { id: 'edit', label: 'Edit my draft for clarity', icon: 'Pencil' },
  { id: 'stats', label: 'What did readers like in September?', icon: 'Gauge' },
  { id: 'links', label: 'Check the draft for broken links', icon: 'Link' }
];

const replies = {
  'Ideas for next week’s post': 'Three angles readers responded to this quarter:\n\n1. **A postmortem** of the RSS date bug, told as a short story.\n2. **A field guide** to local-first tools you already use.\n3. **A reading list** of the five posts people finish most often.',
  default: 'I can help with that. Open the draft you want me to look at, or paste the text here.'
};

export function Pattern() {
  const [prompt, setPrompt] = useState(null);
  const start = (text) => setPrompt(text);
  return (
    <div className='h-140 w-full'>
      <ChatShell
        title={prompt ? 'Planning next week' : 'New chat'}
        headerActions={prompt ? (
          <Button size='xs' variant='ghost' onClick={() => setPrompt(null)}>
            <RegistryIcon lucide='SquarePen' />
            New chat
          </Button>
        ) : null}
        composer={<ChatPromptComposer onSubmit={start} labels={{ placeholder: 'Message Gaudi' }} />}
      >
        <div role='region' aria-label='Conversation' tabIndex={0} className='min-h-0 flex-1 overflow-y-auto focus-visible:outline-none'>
          {prompt ? (
            <div className='mx-auto flex w-full max-w-2xl flex-col gap-5 p-4'>
              <ChatMessage align='end'>
                <ChatMessageContent>
                  <span className='sr-only'>You said</span>
                  <ChatBubble align='end'><ChatBubbleContent>{prompt}</ChatBubbleContent></ChatBubble>
                </ChatMessageContent>
              </ChatMessage>
              <ChatMessage>
                <ChatMessageAvatar className='self-start'>
                  <ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='md' decorative />
                </ChatMessageAvatar>
                <ChatMessageContent>
                  <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
                  <ChatMessageParts parts={[{ type: 'text', text: replies[prompt] || replies.default }]} />
                </ChatMessageContent>
              </ChatMessage>
            </div>
          ) : (
            <div className='grid h-full place-items-center'>
              <EmptyState
                title={<h2>What are we writing today?</h2>}
                description='Gaudi knows your published posts, drafts and reader stats. Ask it to plan, edit or check anything.'
                actions={
                  <ChatMessageParts parts={[{ type: 'suggestions', items: suggestions }]} onSuggestion={start} />
                }
              />
            </div>
          )}
        </div>
      </ChatShell>
    </div>
  );
}
