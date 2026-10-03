'use client';
import { useState } from 'react';
import { ChatShell } from '../../../../src/components/blocks/Chat/parts/chat-shell.jsx';
import { ChatThreadNav } from '../../../../src/components/chat/ChatThreadNav/parts/chat-thread-nav.jsx';
import { ChatSessionList } from '../../../../src/components/chat/ChatSessionList/parts/chat-sessions.jsx';
import { ChatFileExplorer } from '../../../../src/components/chat/ChatFileExplorer/parts/chat-files.jsx';
import { ChatActivity } from '../../../../src/components/chat/ChatActivityHistory/parts/chat-activity.jsx';
import { ChatPlan } from '../../../../src/components/chat/ChatPlanPanel/parts/chat-plan.jsx';
import { default as Avatar } from '../../../../src/components/core/Avatar/index.js';
import { Bubble, BubbleContent } from '../../../../src/components/chat/Bubble/parts/bubble.jsx';
import { Message, MessageAvatar, MessageContent, MessageHeader } from '../../../../src/components/chat/Message/parts/message.jsx';
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport, useMessageScroller, useMessageScrollerVisibility } from '../../../../src/components/chat/MessageList/parts/message-scroller.jsx';
import { MessageParts } from '../../../../src/components/chat/MessageList/parts/message-parts.jsx';
import { MessageFeedback } from '../../../../src/components/chat/ChatFeedback/parts/message-feedback.jsx';
import { PromptComposer } from '../../../../src/components/chat/ChatInput/parts/prompt-composer.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

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

const turns = [
  { id: 't1', role: 'user', text: 'Review PR #482. It adds offline sync for drafts.' },
  {
    id: 't2',
    role: 'assistant',
    parts: [
      { type: 'tool', name: 'fetch_pull_request', description: '#482 · 3 files changed', status: 'done', duration: '0.6s', output: { files: 3, additions: 48, deletions: 10, author: 'Daniel Okafor' } },
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

const prompts = turns.filter((turn) => turn.role === 'user');

function GaudiMark() {
  return (
    <span className='bg-accent-subtle text-accent grid size-8 place-items-center rounded-full'>
      <RegistryIcon lucide='Sparkles' className='size-4' />
    </span>
  );
}

// The header navigator reads where the reader is from the scroller that owns the thread.
function PromptNav() {
  const { scrollToMessage } = useMessageScroller();
  const { currentAnchorId } = useMessageScrollerVisibility();
  return (
    <ChatThreadNav
      turns={prompts.map((turn) => ({ id: turn.id, label: turn.text }))}
      current={currentAnchorId || prompts[0].id}
      onNavigate={(id) => scrollToMessage(id, { align: 'start', behavior: 'smooth' })}
    />
  );
}

export function Pattern() {
  const [sessions, setSessions] = useState(initialSessions);
  const [active, setActive] = useState('pr-482');
  const [opened, setOpened] = useState('');
  const navigation = (
    <>
      <ChatSessionList
        sessions={sessions}
        activeId={active}
        onSelect={setActive}
        onNew={() => setActive('pr-482')}
        onRename={(id, title) => setSessions((list) => list.map((item) => (item.id === id ? { ...item, title } : item)))}
        onDelete={(id) => setSessions((list) => list.filter((item) => item.id !== id))}
      />
      <ChatFileExplorer items={files} defaultExpanded={['src', 'tests']} onSelect={(id, item) => setOpened(item.name)} />
      <p role='status' className='text-text-muted text-xs'>{opened ? `Opened ${opened}` : ''}</p>
    </>
  );
  return (
    <div className='h-160 w-full'>
      <MessageScrollerProvider scrollMargin={12}>
        <ChatShell
          title='Review: offline draft sync'
          subtitle='Pull request #482 · 4 messages'
          navigation={navigation}
          details={
            <>
              <ChatPlan title='Review plan' steps={plan} />
              <ChatActivity items={activity} />
            </>
          }
          headerActions={<PromptNav />}
          composer={<PromptComposer labels={{ placeholder: 'Ask about the diff, or @ mention a reviewer' }} mentions={[{ id: 'daniel', name: 'Daniel Okafor', description: 'Author', avatar: '/avatars/men/32.jpg' }]} onSubmit={() => {}} />}
        >
          <MessageScroller>
            <MessageScrollerViewport aria-label='Conversation'>
              <MessageScrollerContent className='gap-5 p-4'>
                {turns.map((turn) => (
                  <MessageScrollerItem key={turn.id} messageId={turn.id} scrollAnchor={turn.role === 'user'}>
                    {turn.role === 'user' ? (
                      <Message align='end'>
                        <MessageAvatar>
                          <Avatar src='/avatars/women/44.jpg' name='Sarah Chen' size='sm' shape='circle' alt='' />
                        </MessageAvatar>
                        <MessageContent>
                          <span className='sr-only'>Sarah Chen said</span>
                          <Bubble align='end'><BubbleContent>{turn.text}</BubbleContent></Bubble>
                        </MessageContent>
                      </Message>
                    ) : (
                      <Message>
                        <MessageAvatar className='self-start'><GaudiMark /></MessageAvatar>
                        <MessageContent>
                          <MessageHeader className='px-0'>Gaudi</MessageHeader>
                          <MessageParts parts={turn.parts} />
                          <MessageFeedback copyText={turn.parts.find((part) => part.type === 'text')?.text} />
                        </MessageContent>
                      </Message>
                    )}
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </ChatShell>
      </MessageScrollerProvider>
    </div>
  );
}
