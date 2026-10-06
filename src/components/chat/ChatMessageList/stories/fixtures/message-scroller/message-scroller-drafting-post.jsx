'use client';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { useEffect, useState } from 'react';
import { default as Avatar } from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageParts } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatMessageFeedback } from '@gaudi/design-system/chat/ChatFeedback';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const prompt = 'Outline a post on why we moved the blog to local-first drafts. Keep it short and add the sync snippet.';
const reply = `## Local-first drafts, in four beats

1. **The problem.** Drafts lived on the server, so a flaky train connection meant lost paragraphs.
2. **The change.** Every draft now saves to the browser first and syncs when the network is back.
3. **What readers notice.** Nothing, which is the point. Editors stop losing work.
4. **What it cost.** A conflict rule and one background job.

The sync step is small:

\`\`\`js
export async function syncDraft(draft) {
  const saved = await db.drafts.put(draft);
  if (navigator.onLine) await api.drafts.push(saved);
  return saved;
}
\`\`\`

Want me to turn beat 2 into the opening paragraph?`;

// Think for a moment, then reveal the reply a few words at a time; readers who reduce motion get it whole.
function useStream(text, running) {
  const [length, setLength] = useState(0);
  useEffect(() => {
    if (!running) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setLength(text.length);
      return undefined;
    }
    setLength(0);
    let timer;
    const reveal = () => setLength((current) => {
      const next = text.indexOf(' ', current + 6);
      if (next !== -1) return next;
      clearInterval(timer);
      return text.length;
    });
    const thinking = setTimeout(() => {
      timer = setInterval(reveal, 24);
    }, 1200);
    return () => {
      clearTimeout(thinking);
      clearInterval(timer);
    };
  }, [text, running]);
  return text.slice(0, length);
}

export function Pattern() {
  const [run, setRun] = useState(1);
  const text = useStream(reply, run);
  const streaming = text.length < reply.length;
  const parts = [
    { type: 'reasoning', duration: 3, steps: [{ status: 'done', text: 'Read the migration notes and the last two posts on drafts.' }, { status: streaming ? 'running' : 'done', text: 'Kept the outline to four beats so it fits one screen.' }] },
    { type: 'text', text }
  ];
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-5'>
      <ChatMessage align='end'>
        <ChatMessageAvatar>
          <Avatar src='/avatars/person-20.svg' name='Sabine Okafor' size='sm' shape='circle' alt='' />
        </ChatMessageAvatar>
        <ChatMessageContent>
          <span className='sr-only'>Sabine Okafor said</span>
          <ChatBubble align='end'>
            <ChatBubbleContent>{prompt}</ChatBubbleContent>
          </ChatBubble>
        </ChatMessageContent>
      </ChatMessage>
      <ChatMessage>
        <ChatMessageAvatar className='self-start'>
          <ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='md' decorative />
        </ChatMessageAvatar>
        <ChatMessageContent>
          <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
          {/* The reply stays aria-busy while it streams; one polite status says when it starts and ends. */}
          <ChatMessageParts parts={parts} streaming={streaming} />
          <span role='status' className='sr-only'>{streaming ? 'Gaudi is replying.' : 'Gaudi replied.'}</span>
          {streaming ? null : (
            <ChatMessageFeedback copyText={reply} onRegenerate={() => setRun((current) => current + 1)} />
          )}
        </ChatMessageContent>
      </ChatMessage>
      <div className='flex justify-end'>
        <Button size='xs' variant='outline' onClick={() => setRun((current) => current + 1)} disabled={streaming}>
          <RegistryIcon lucide='RotateCcw' />
          Replay the reply
        </Button>
      </div>
    </div>
  );
}
