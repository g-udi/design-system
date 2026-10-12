'use client';
import { useEffect, useRef, useState } from 'react';
import { ChatShell } from '@gaudi/design-system/blocks/Chat';
import { ChatSessionList } from '@gaudi/design-system/chat/ChatSessionList';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageScroller, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatMessageParts } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatMessageFeedback } from '@gaudi/design-system/chat/ChatFeedback';
import { ChatPromptComposer, ChatPromptQueue } from '@gaudi/design-system/chat/ChatInput';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
import { Label } from '@gaudi/design-system/core/Field';
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks/a11y/use-prefers-reduced-motion';

const draft = `Drafts used to live on the server. On a train with patchy signal that meant lost paragraphs, and editors learned to copy their work into a notes app before pressing save.

We moved every draft to the browser first. It syncs when the connection comes back, and a single rule decides which edit wins.`;

const answers = {
  'Make the opening punchier.': 'Try this opening:\n\n> **You should never lose a paragraph to a tunnel.** Until last month, our editors did.\n\nIt names the reader’s fear first and saves the history for the second line.',
  default: 'Here is a tighter version of that paragraph, about 30% shorter:\n\n> Every draft now saves to the browser first and syncs when the network returns. One rule picks the newer edit.'
};

let nextId = 1;

export function Pattern() {
  const reducedMotion = usePrefersReducedMotion();
  const [turns, setTurns] = useState([{ id: 'u0', role: 'user', text: 'Make the opening punchier.' }, { id: 'a0', role: 'assistant', text: '', target: answers['Make the opening punchier.'] }]);
  const [queue, setQueue] = useState([]);
  const [sessions, setSessions] = useState([
    { id: 'post', title: 'Local-first drafts post', preview: 'Editing the opening', group: 'Today', live: true },
    { id: 'faq', title: 'FAQ rewrite', preview: 'Shortened 6 answers', group: 'Yesterday' }
  ]);
  const last = turns[turns.length - 1];
  const streaming = last.role === 'assistant' && last.text.length < last.target.length;
  const queueRef = useRef(queue);
  queueRef.current = queue;

  useEffect(() => {
    if (!streaming) {
      // When a reply ends, the next queued follow-up goes out.
      const [next, ...rest] = queueRef.current;
      if (next) {
        setQueue(rest);
        ask(next.text);
      }
      return undefined;
    }
    const timer = setTimeout(() => {
      setTurns((list) => list.map((turn, index) => {
        if (index !== list.length - 1) return turn;
        const cut = reducedMotion ? turn.target.length : turn.target.indexOf(' ', turn.text.length + 4);
        return { ...turn, text: cut === -1 ? turn.target : turn.target.slice(0, cut) };
      }));
    }, 30);
    return () => clearTimeout(timer);
  }, [turns, streaming, reducedMotion]);

  function ask(text) {
    const id = nextId++;
    setTurns((list) => [...list, { id: `u${id}`, role: 'user', text }, { id: `a${id}`, role: 'assistant', text: '', target: answers[text] || answers.default }]);
  }

  return (
    <div className='grid h-150 w-full gap-3 md:grid-cols-[minmax(0,1fr)_22rem]'>
      <div className='bg-surface hidden min-h-0 flex-col gap-2 rounded-(--ds-radius-card) border p-4 md:flex'>
        <Label htmlFor='chat-2-draft'>Draft</Label>
        <Textarea id='chat-2-draft' defaultValue={draft} className='min-h-0 flex-1 resize-none leading-relaxed' />
      </div>
      <ChatMessageScrollerProvider autoScroll>
        <ChatShell
          variant='sidebar'
          title='Writing assistant'
          subtitle='Local-first drafts post'
          navigation={
            <ChatSessionList
              sessions={sessions}
              activeId='post'
              searchable={false}
              onRename={(id, title) => setSessions((list) => list.map((item) => (item.id === id ? { ...item, title } : item)))}
            />
          }
          composer={
            <div className='grid gap-2'>
              <ChatPromptQueue items={queue} onRemove={(id) => setQueue((items) => items.filter((item) => item.id !== id))} onEdit={(id, text) => setQueue((items) => items.map((item) => (item.id === id ? { ...item, text } : item)))} />
              <ChatPromptComposer
                status={streaming ? 'streaming' : 'ready'}
                onStop={() => setTurns((list) => list.map((turn, index) => (index === list.length - 1 ? { ...turn, target: turn.text } : turn)))}
                onSubmit={(text, { queued }) => (queued ? setQueue((items) => [...items, { id: `q${nextId++}`, text }]) : ask(text))}
                labels={{ placeholder: 'Ask about the draft' }}
              />
            </div>
          }
        >
          <ChatMessageScroller>
            <ChatMessageScrollerViewport aria-label='Writing assistant conversation'>
              <ChatMessageScrollerContent className='gap-4 p-3'>
                {turns.map((turn, index) => (
                  <ChatMessageScrollerItem key={turn.id} messageId={turn.id} scrollAnchor={turn.role === 'user'}>
                    {turn.role === 'user' ? (
                      <ChatMessage align='end'>
                        <ChatMessageContent>
                          <span className='sr-only'>You said</span>
                          <ChatBubble align='end'><ChatBubbleContent>{turn.text}</ChatBubbleContent></ChatBubble>
                        </ChatMessageContent>
                      </ChatMessage>
                    ) : (
                      <ChatMessage>
                        <ChatMessageContent>
                          <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
                          <ChatMessageParts parts={[{ type: 'text', text: turn.text || ' ' }]} streaming={index === turns.length - 1 && streaming} />
                          {index === turns.length - 1 && streaming ? null : <ChatMessageFeedback copyText={turn.target} />}
                        </ChatMessageContent>
                      </ChatMessage>
                    )}
                  </ChatMessageScrollerItem>
                ))}
              </ChatMessageScrollerContent>
            </ChatMessageScrollerViewport>
          </ChatMessageScroller>
        </ChatShell>
      </ChatMessageScrollerProvider>
      <span role='status' className='sr-only'>{streaming ? 'Gaudi is replying.' : 'Gaudi replied.'}</span>
    </div>
  );
}
