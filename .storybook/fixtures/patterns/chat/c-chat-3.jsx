'use client';
import { useState } from 'react';
import { ChatShell } from '../../../../src/components/blocks/Chat/parts/chat-shell.jsx';
import { ChatWelcome } from '../../../../src/components/chat/ChatWelcome/parts/chat-welcome.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Bubble, BubbleContent } from '../../../../src/components/chat/Bubble/parts/bubble.jsx';
import { Message, MessageAvatar, MessageContent, MessageHeader } from '../../../../src/components/chat/Message/parts/message.jsx';
import { MessageParts } from '../../../../src/components/chat/MessageList/parts/message-parts.jsx';
import { PromptComposer } from '../../../../src/components/chat/ChatInput/parts/prompt-composer.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

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
        composer={<PromptComposer onSubmit={start} labels={{ placeholder: 'Message Gaudi' }} />}
      >
        <div role='region' aria-label='Conversation' tabIndex={0} className='min-h-0 flex-1 overflow-y-auto focus-visible:outline-none'>
          {prompt ? (
            <div className='mx-auto flex w-full max-w-2xl flex-col gap-5 p-4'>
              <Message align='end'>
                <MessageContent>
                  <span className='sr-only'>You said</span>
                  <Bubble align='end'><BubbleContent>{prompt}</BubbleContent></Bubble>
                </MessageContent>
              </Message>
              <Message>
                <MessageAvatar className='self-start'>
                  <span className='bg-accent-subtle text-accent grid size-8 place-items-center rounded-full'>
                    <RegistryIcon lucide='Sparkles' className='size-4' />
                  </span>
                </MessageAvatar>
                <MessageContent>
                  <MessageHeader className='px-0'>Gaudi</MessageHeader>
                  <MessageParts parts={[{ type: 'text', text: replies[prompt] || replies.default }]} />
                </MessageContent>
              </Message>
            </div>
          ) : (
            <div className='grid h-full place-items-center'>
              <ChatWelcome
                title='What are we writing today?'
                description='Gaudi knows your published posts, drafts and reader stats. Ask it to plan, edit or check anything.'
                suggestions={suggestions}
                onSelect={start}
              />
            </div>
          )}
        </div>
      </ChatShell>
    </div>
  );
}
