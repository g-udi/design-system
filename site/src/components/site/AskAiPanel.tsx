'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Dialog from '@gaudi/design-system/core/Dialog';
import Icon from '@gaudi/design-system/core/Icon';
import { GaudiLogo } from '@gaudi/design-system/icons/brands/gaudi';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageParts, ChatMessageScroller, ChatMessageScrollerButton, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport } from '@gaudi/design-system/chat/ChatMessageList';
import { basePath } from '@/lib/nav';

const MAX_QUESTION = 500;
const SUGGESTIONS = [
  'How do I set up Gaudi in a Next.js app?',
  'Which component should I use for a sortable data table?',
  'How do I import a theme from tweakcn?',
  'How do I build a chat composer with send and stop?'
];

interface Source { title: string; url: string; description: string }
interface Turn {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  sources?: Source[];
  status?: 'streaming' | 'done' | 'error';
  error?: string;
}

const partsOf = (turn: Turn) => [
  ...(turn.text ? [{ type: 'text', text: turn.text }] : []),
  ...(turn.status === 'error' ? [{ type: 'error', title: 'No answer', text: turn.error }] : []),
  ...(turn.sources || []).map((source) => ({ type: 'source', title: source.title, url: `${basePath}${source.url}`, site: 'Gaudi docs', excerpt: source.description }))
];

/** The Ask AI dialog: questions answered from the docs by /api/ask, citing the pages used. */
/** `question` (from the search dialog) is asked once each time it changes while the panel is open. */
export function AskAiPanel({ open, onOpenChange, question }: { open: boolean; onOpenChange: (open: boolean) => void; question?: string }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [status, setStatus] = useState<'ready' | 'streaming'>('ready');
  const [announcement, setAnnouncement] = useState('');
  const controller = useRef<AbortController | null>(null);
  const nextId = useRef(1);

  const asked = useRef<string | null>(null);
  const askRef = useRef<(raw: string) => void>(() => {});
  useEffect(() => {
    if (!open || !question || asked.current === question) return;
    asked.current = question;
    askRef.current(question);
  }, [open, question]);

  const update = (id: number, patch: Partial<Turn> | ((turn: Turn) => Partial<Turn>)) =>
    setTurns((list) => list.map((turn) => (turn.id === id ? { ...turn, ...(typeof patch === 'function' ? patch(turn) : patch) } : turn)));

  const ask = async (raw: string, options?: { queued?: boolean }) => {
    const question = raw.trim().slice(0, MAX_QUESTION);
    if (!question || options?.queued || status === 'streaming') return;
    const history = turns.filter((turn) => turn.status !== 'error' && turn.text).slice(-6).map((turn) => ({ role: turn.role, content: turn.text }));
    const userId = nextId.current++;
    const id = nextId.current++;
    setTurns((list) => [...list, { id: userId, role: 'user', text: question }, { id, role: 'assistant', text: '', status: 'streaming' }]);
    setStatus('streaming');
    setAnnouncement('Answering…');
    const abort = new AbortController();
    controller.current = abort;
    try {
      const response = await fetch(`${basePath}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history }),
        signal: abort.signal
      });
      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || 'The assistant could not answer. Try again.');
      }
      // First line: the cited pages as JSON; then the answer text as it streams.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let header = true;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        if (header) {
          const newline = buffer.indexOf('\n');
          if (newline === -1) continue;
          const sources = (JSON.parse(buffer.slice(0, newline)) as { sources: Source[] }).sources;
          buffer = buffer.slice(newline + 1);
          header = false;
          update(id, { sources });
        }
        const text = buffer;
        update(id, { text });
      }
      update(id, { status: 'done' });
      setAnnouncement('Answer ready.');
    } catch (error) {
      if (abort.signal.aborted) {
        update(id, { status: 'done' });
        setAnnouncement('Stopped.');
      } else {
        update(id, { status: 'error', error: (error as Error).message || 'Something went wrong.' });
        setAnnouncement('The assistant could not answer.');
      }
    } finally {
      controller.current = null;
      setStatus('ready');
    }
  };
  askRef.current = ask;

  const stop = () => controller.current?.abort();
  const reset = () => {
    stop();
    setTurns([]);
    setAnnouncement('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title='Ask AI'
      description='Answers come from the Gaudi documentation and link the pages they use. They can be wrong, so check the cited pages.'
      className='w-[min(46rem,calc(100vw-1rem))]'
      footer={
        <div className='flex w-full min-w-0 flex-col gap-2'>
          <ChatPromptComposer
            variant='card'
            status={status}
            onSubmit={ask}
            onStop={stop}
            labels={{ placeholder: 'Ask about components, props, theming…' }}
            textareaProps={{ maxLength: MAX_QUESTION, 'aria-label': 'Question about the documentation' }}
            leftControls={turns.length ? (
              <Button variant='ghost' tone='neutral' size='xs' onClick={reset}>
                <Icon name='SquarePen' decorative size='xs' />
                New chat
              </Button>
            ) : null}
          />
        </div>
      }
    >
      <p role='status' className='sr-only'>{announcement}</p>
      {turns.length ? (
        <ChatMessageScrollerProvider autoScroll>
          <ChatMessageScroller className='h-[min(52dvh,30rem)]'>
            <ChatMessageScrollerViewport aria-label='Conversation'>
              <ChatMessageScrollerContent className='gap-5 py-2'>
                {turns.map((turn) => (
                  <ChatMessageScrollerItem key={turn.id} scrollAnchor={turn.role === 'user'}>
                    {turn.role === 'user' ? (
                      <ChatMessage align='end'>
                        <ChatMessageContent>
                          <span className='sr-only'>You asked</span>
                          <ChatBubble align='end'><ChatBubbleContent>{turn.text}</ChatBubbleContent></ChatBubble>
                        </ChatMessageContent>
                      </ChatMessage>
                    ) : (
                      <ChatMessage>
                        <ChatMessageAvatar className='self-start rounded-(--ds-radius-control) bg-transparent'>
                          {/* The Gaudi tile itself is the assistant's avatar. */}
                          <GaudiLogo className='size-8 rounded-(--ds-radius-control)' aria-hidden='true' />
                        </ChatMessageAvatar>
                        <ChatMessageContent className='min-w-0'>
                          <ChatMessageHeader className='px-0'>Gaudi docs</ChatMessageHeader>
                          {turn.status === 'streaming' && !turn.text ? (
                            <p className='text-sm text-text-muted'>Reading the docs…</p>
                          ) : null}
                          <ChatMessageParts parts={partsOf(turn)} streaming={turn.status === 'streaming'} sourcesLabel='Pages used' />
                        </ChatMessageContent>
                      </ChatMessage>
                    )}
                  </ChatMessageScrollerItem>
                ))}
              </ChatMessageScrollerContent>
            </ChatMessageScrollerViewport>
            <ChatMessageScrollerButton />
          </ChatMessageScroller>
        </ChatMessageScrollerProvider>
      ) : (
        <div className='flex flex-col gap-3 py-2'>
          <p className='text-sm text-text-muted'>Try one of these, or ask your own question:</p>
          <ul aria-label='Suggested questions' className='flex flex-wrap gap-2'>
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion} className='max-w-full min-w-0'>
                <Button size='sm' variant='outline' tone='neutral' className='h-auto max-w-full py-1.5 text-start whitespace-normal break-words' onClick={() => ask(suggestion)}>
                  {suggestion}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Dialog>
  );
}
