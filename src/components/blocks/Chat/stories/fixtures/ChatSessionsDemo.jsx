import { chatModels, chatModelProviders } from '../../../../chat/ChatInput/stories/fixtures/chatModels.js';
import { useEffect, useId, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { cn } from '@gaudi/design-system/utilities/cn';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatModelSelect, ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';
import { ChatSessionList } from '@gaudi/design-system/chat/ChatSessionList';
import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageParts, ChatMessageScroller, ChatMessageScrollerButton, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatPersona } from '@gaudi/design-system/chat/ChatPersona';
import { ChatShell } from '@gaudi/design-system/blocks/Chat';

const initialSessions = [
  { id: 'post', title: 'Local-first drafts post', preview: 'Outline ready for review', group: 'Today', messages: [
    { role: 'user', text: 'Outline the local-first drafts post.' },
    { role: 'assistant', text: 'Start with the moment a connection drops. Then explain how local drafts keep writing uninterrupted, show how changes sync, and close with the trade-offs.' }
  ] },
  { id: 'rss', title: 'Fix the RSS feed dates', preview: 'Timezone was dropped', group: 'Today', messages: [
    { role: 'user', text: 'Why are the feed dates a day early?' },
    { role: 'assistant', text: 'The timezone was dropped when the date was formatted. Keep the offset when generating the feed, then check a post published close to midnight.' }
  ] },
  { id: 'teaser', title: 'Newsletter teaser', preview: 'Three subject lines', group: 'This week', messages: [
    { role: 'user', text: 'Suggest three subject lines for the newsletter.' },
    { role: 'assistant', text: 'Try “A smaller first draft”, “Make room for the next idea”, or “What changed this week”.' }
  ] },
  { id: 'tags', title: 'Tag cleanup', preview: 'Merged 12 duplicate tags', group: 'Older', messages: [
    { role: 'user', text: 'Review the duplicate tags.' },
    { role: 'assistant', text: 'The duplicate tags are merged. The remaining names use one spelling and consistent capitalization.' }
  ] }
];

/** Local demo data belongs to the host; the public parts own rendering and interaction. */
export function ChatSessionsDemo({ variant = 'sidebar', searchable = true }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [activeId, setActiveId] = useState('post');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [model, setModel] = useState('gpt-4o');
  const nextId = useRef(0);
  const historyTrigger = useRef(null);
  const historyPanel = useRef(null);
  const historyId = useId();
  const panel = variant === 'sidebar';
  const showingHistory = panel && historyOpen;
  const active = sessions.find((session) => session.id === activeId);
  const updateActive = (update) => setSessions((current) => current.map((session) => session.id === activeId ? update(session) : session));

  useEffect(() => {
    if (showingHistory) (historyPanel.current?.querySelector('input') || historyPanel.current)?.focus();
  }, [showingHistory]);

  const closeHistory = () => {
    setHistoryOpen(false);
    historyTrigger.current?.focus();
  };
  const startChat = () => {
    const id = `new-${++nextId.current}`;
    setSessions((current) => [{ id, title: 'New chat', group: 'Today', messages: [] }, ...current]);
    setActiveId(id);
    closeHistory();
  };
  const sessionList = (
    <ChatSessionList
      sessions={sessions}
      activeId={activeId}
      searchable={searchable}
      onSelect={(id) => { setActiveId(id); closeHistory(); }}
      onNew={startChat}
      onRename={(id, title) => setSessions((current) => current.map((session) => session.id === id ? { ...session, title } : session))}
      onDelete={(id) => {
        const remaining = sessions.filter((session) => session.id !== id);
        setSessions(remaining);
        if (id === activeId) setActiveId(remaining[0]?.id ?? null);
      }}
      labels={{ title: 'Chat history', deleteDescription: 'This conversation will be removed from the demo.' }}
    />
  );

  return (
    <div className={cn('h-150 w-full min-w-0', panel && 'max-w-md')}>
      <ChatShell
        variant={variant}
        title={active?.title || 'New chat'}
        subtitle='Gaudi · Writing assistant'
        labels={{ navigation: 'Chat history', openNavigation: 'Chat history' }}
        navigation={panel ? null : sessionList}
        headerActions={
          <>
            {panel ? (
              <Button ref={historyTrigger} size='icon-sm' variant={showingHistory ? 'secondary' : 'ghost'} aria-label={showingHistory ? 'Back to conversation' : 'Chat history'} title={showingHistory ? 'Back to conversation' : 'Chat history'} aria-expanded={showingHistory} aria-controls={historyId} onClick={() => showingHistory ? closeHistory() : setHistoryOpen(true)}>
                <RegistryIcon lucide={showingHistory ? 'ArrowLeft' : 'History'} />
              </Button>
            ) : null}
            <Button size='icon-sm' variant='ghost' aria-label='Start new chat' title='New chat' onClick={startChat}><RegistryIcon lucide='SquarePen' /></Button>
          </>
        }
        composer={!showingHistory && active ? (
          <ChatPromptComposer
            key={activeId}
            variant='card'
            value={active.draft || ''}
            onValueChange={(draft) => updateActive((session) => ({ ...session, draft }))}
            onSubmit={(text) => updateActive((session) => ({ ...session, title: session.messages.length ? session.title : text.slice(0, 80), preview: text, messages: [...session.messages, { role: 'user', text }] }))}
            leftControls={<ChatModelSelect searchable models={chatModels} providers={chatModelProviders} value={model} onValueChange={setModel} />}
            labels={{ placeholder: 'Message Gaudi' }}
          />
        ) : null}
      >
        {panel ? (
          <div id={historyId} ref={historyPanel} hidden={!showingHistory} role='region' aria-label='Chat history' tabIndex={-1} className='min-h-0 flex-1 overflow-y-auto p-3 focus-visible:outline-none' onKeyDown={(event) => {
            if (event.key === 'Escape' && !event.defaultPrevented && !event.nativeEvent.isComposing && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && event.currentTarget.contains(event.target)) { event.preventDefault(); closeHistory(); }
          }}>
            {sessionList}
          </div>
        ) : null}
        <div hidden={showingHistory} className='min-h-0 flex-1'>
          {active?.messages.length ? (
            <ChatMessageScrollerProvider key={activeId}>
              <ChatMessageScroller>
                <ChatMessageScrollerViewport aria-label='Conversation messages'>
                  <ChatMessageScrollerContent className='gap-5 p-4'>
                    {active.messages.map((message, index) => (
                      <ChatMessageScrollerItem key={index} messageId={`${activeId}-${index}`} scrollAnchor={message.role === 'user'}>
                        <ChatMessage align={message.role === 'user' ? 'end' : 'start'}>
                          <ChatMessageContent>
                            {message.role === 'user' ? <><span className='sr-only'>You said</span><ChatBubble align='end'><ChatBubbleContent>{message.text}</ChatBubbleContent></ChatBubble></> : <>
                              <ChatMessageHeader className='gap-2'><ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='sm' decorative />Gaudi</ChatMessageHeader>
                              <ChatMessageParts parts={[{ type: 'text', text: message.text }]} />
                            </>}
                          </ChatMessageContent>
                        </ChatMessage>
                      </ChatMessageScrollerItem>
                    ))}
                  </ChatMessageScrollerContent>
                </ChatMessageScrollerViewport>
                <ChatMessageScrollerButton />
              </ChatMessageScroller>
            </ChatMessageScrollerProvider>
          ) : (
            <div className='flex h-full min-h-0 items-center overflow-y-auto p-4'>
              <EmptyState icon={<ChatPersona variant='iridescent' state='idle' size='sm' aria-hidden='true' />} title={<h3>What are we writing today?</h3>} description='Start a conversation or continue a previous chat.' actions={!active ? <Button onClick={startChat}>Start a conversation</Button> : undefined} />
            </div>
          )}
        </div>
      </ChatShell>
    </div>
  );
}
