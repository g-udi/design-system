'use client';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { useRef, useState } from 'react';
import { ChatShell } from '@gaudi/design-system/blocks/Chat';
import { ChatThreadNav } from '@gaudi/design-system/chat/ChatThreadNav';
import { ChatSessionList } from '@gaudi/design-system/chat/ChatSessionList';
import { ChatFileExplorer } from '@gaudi/design-system/chat/ChatFileExplorer';
import { ChatActivity } from '@gaudi/design-system/chat/ChatActivityHistory';
import { ChatPlan } from '@gaudi/design-system/chat/ChatPlanPanel';
import { default as Avatar } from '@gaudi/design-system/core/Avatar';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageScroller, ChatMessageScrollerButton, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport, useMessageScroller, useMessageScrollerVisibility } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatMessageParts } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatMessageFeedback } from '@gaudi/design-system/chat/ChatFeedback';
import { ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';

const initialSessions = [
  { id: 'pr-482', title: 'Review: offline draft sync', preview: 'Two issues in the conflict rule', group: 'Today', live: true },
  { id: 'rss', title: 'Fix the RSS feed dates', preview: 'Timezone was dropped on build', group: 'Today' },
  { id: 'og', title: 'Social cards for series posts', preview: 'Drafted three layouts', group: 'Yesterday' },
  { id: 'search', title: 'Search ranking for old posts', preview: 'Boost by recency, not views', group: 'Last week' }
];

const files = {
  root: { name: 'Pull request #482', children: ['src', 'tests', 'notes'] },
  src: { name: 'src', children: ['sync', 'drafts'] },
  sync: { name: 'sync.js', meta: '+42 −8' },
  drafts: { name: 'drafts-store.js', meta: '+6 −2' },
  tests: { name: 'tests', children: ['sync-test'] },
  'sync-test': { name: 'sync.test.js', meta: 'new' },
  notes: { name: 'review-notes.md', meta: 'by Gaudi' }
};

const initialTurns = [
  { id: 't1', role: 'user', text: 'Review PR #482. It adds offline sync for drafts.' },
  {
    id: 't2',
    role: 'assistant',
    parts: [
      { type: 'tool', name: 'fetch_pull_request', description: '#482 · 3 files changed', status: 'done', duration: '0.6s', output: { files: 3, additions: 48, deletions: 10, author: 'Ansel Mwangi' } },
      { type: 'tool', name: 'run_tests', description: 'tests/sync.test.js', status: 'done', duration: '4.1s', output: { passed: 11, failed: 1, skipped: 0 } },
      { type: 'text', text: 'Mostly good. One real problem and one nit.\n\n**1. Conflicts drop the newer edit.** The merge keeps whichever copy synced last, not whichever was edited last:\n\n```diff\n- if (remote.syncedAt > local.syncedAt) return remote;\n+ if (remote.updatedAt > local.updatedAt) return remote;\n```\n\n**2. Nit:** `syncDraft` swallows the push error, so the failing test never reports a reason.' }
    ]
  },
  { id: 't3', role: 'user', text: 'Agreed on 1. Can you write the fix and a test for it?' },
  {
    id: 't4',
    role: 'assistant',
    parts: [
      { type: 'tool', name: 'edit_file', description: 'src/sync.js', status: 'done', duration: '0.3s' },
      { type: 'tool', name: 'run_tests', description: 'tests/sync.test.js', status: 'done', duration: '3.8s', output: { passed: 12, failed: 0, skipped: 0 } },
      { type: 'text', text: 'Done. The merge now compares `updatedAt`, and a new test edits the same draft offline on two devices to prove the newer edit wins. All 12 tests pass.' },
      { type: 'file', name: 'review-notes.md', size: '3 KB', description: 'Summary for the PR thread' }
    ]
  }
];

const plan = [
  { id: 'read', title: 'Read the diff', status: 'done' },
  { id: 'test', title: 'Run the sync tests', status: 'done', description: '1 failure in conflict handling' },
  { id: 'fix', title: 'Fix the conflict rule', status: 'done', todos: [{ title: 'Compare updatedAt', status: 'done' }, { title: 'Add a two-device test', status: 'done' }] },
  { id: 'notes', title: 'Post review notes', status: 'running', owner: 'Gaudi' },
  { id: 'merge', title: 'Request a second approval', status: 'pending' }
];

const activity = [
  { id: 'a1', time: '10:02', title: 'Fetched PR #482', icon: 'GitPullRequest' },
  { id: 'a2', time: '10:03', title: 'Ran 12 tests, 1 failed', status: 'failed' },
  { id: 'a3', time: '10:09', title: 'Edited src/sync.js', icon: 'Pencil' },
  { id: 'a4', time: '10:10', title: 'All tests passed', status: 'done' }
];

// The header navigator reads where the reader is from the scroller that owns the thread.
function PromptNav({ turns }) {
  const prompts = turns.filter((turn) => turn.role === 'user');
  const { scrollToMessage } = useMessageScroller();
  const { currentAnchorId } = useMessageScrollerVisibility();
  return (
    <ChatThreadNav
      turns={prompts.map((turn) => ({ id: turn.id, label: turn.text }))}
      current={currentAnchorId || prompts[0]?.id}
      onNavigate={(id) => scrollToMessage(id, { align: 'start', behavior: 'smooth' })}
    />
  );
}

export function Pattern() {
  const [sessions, setSessions] = useState(initialSessions);
  const [active, setActive] = useState('pr-482');
  const [opened, setOpened] = useState('');
  const [messages, setMessages] = useState({ 'pr-482': initialTurns });
  const nextId = useRef(0);
  const turns = messages[active] ?? [];
  const current = sessions.find((session) => session.id === active);
  const newChat = () => {
    const id = `chat-${++nextId.current}`;
    setSessions((list) => [{ id, title: 'New chat', group: 'Today' }, ...list]);
    setActive(id);
    return id;
  };
  const send = (text) => {
    const id = active ?? newChat();
    const turn = { id: `turn-${++nextId.current}`, role: 'user', text };
    setMessages((items) => ({ ...items, [id]: [...(items[id] ?? []), turn] }));
  };
  const navigation = (
    <>
      <ChatSessionList
        sessions={sessions}
        activeId={active}
        onSelect={setActive}
        onNew={newChat}
        onRename={(id, title) => setSessions((list) => list.map((item) => (item.id === id ? { ...item, title } : item)))}
        onDelete={(id) => {
          setSessions((list) => list.filter((item) => item.id !== id));
          setMessages((items) => { const next = { ...items }; delete next[id]; return next; });
          if (id === active) setActive(sessions.find((item) => item.id !== id)?.id ?? null);
        }}
      />
      <ChatFileExplorer items={files} defaultExpanded={['src', 'tests']} onSelect={(id, item) => setOpened(item.name)} />
      <p role='status' className='text-text-muted text-xs'>{opened ? `Opened ${opened}` : ''}</p>
    </>
  );
  return (
    <div className='h-160 w-full'>
      <ChatMessageScrollerProvider scrollMargin={12}>
        <ChatShell
          title={current?.title ?? 'New chat'}
          subtitle={`${turns.length} messages`}
          navigation={navigation}
          details={
            <>
              <ChatPlan title='Review plan' steps={plan} />
              <ChatActivity items={activity} />
            </>
          }
          headerActions={<PromptNav turns={turns} />}
          composer={<ChatPromptComposer labels={{ placeholder: 'Ask about the diff, or @ mention a reviewer' }} mentions={[{ id: 'daniel', name: 'Ansel Mwangi', description: 'Author', avatar: '/avatars/person-41.svg' }]} onSubmit={send} />}
        >
          <ChatMessageScroller>
            <ChatMessageScrollerViewport aria-label='Conversation'>
              <ChatMessageScrollerContent className='gap-5 p-4'>
                {turns.map((turn) => (
                  <ChatMessageScrollerItem key={turn.id} messageId={turn.id} scrollAnchor={turn.role === 'user'}>
                    {turn.role === 'user' ? (
                      <ChatMessage align='end'>
                        <ChatMessageAvatar>
                          <Avatar src='/avatars/person-20.svg' name='Sabine Okafor' size='sm' shape='circle' alt='' />
                        </ChatMessageAvatar>
                        <ChatMessageContent>
                          <span className='sr-only'>Sabine Okafor said</span>
                          <ChatBubble align='end'><ChatBubbleContent>{turn.text}</ChatBubbleContent></ChatBubble>
                        </ChatMessageContent>
                      </ChatMessage>
                    ) : (
                      <ChatMessage>
                        <ChatMessageAvatar className='self-start'><ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='md' decorative /></ChatMessageAvatar>
                        <ChatMessageContent>
                          <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
                          <ChatMessageParts parts={turn.parts} />
                          <ChatMessageFeedback copyText={turn.parts.find((part) => part.type === 'text')?.text} />
                        </ChatMessageContent>
                      </ChatMessage>
                    )}
                  </ChatMessageScrollerItem>
                ))}
              </ChatMessageScrollerContent>
            </ChatMessageScrollerViewport>
            <ChatMessageScrollerButton />
          </ChatMessageScroller>
        </ChatShell>
      </ChatMessageScrollerProvider>
    </div>
  );
}
