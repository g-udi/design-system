# Chat

`ChatShell` frames a conversation, either as a full page or as a narrow assistant panel beside other work. Everything inside it comes from the Chat area (`@gaudi/design-system/chat`):

- the turns: `ChatMessage`, `ChatBubble`, `ChatMessageParts` and `ChatMessageScroller`;
- the composer: `ChatPromptComposer`, `ChatPromptQueue` and `ChatModelSelect`;
- the side columns: `ChatSessionList`, `ChatWorkspace`, `ChatFileExplorer`, `ChatPlan` and `ChatActivity`;
- the empty state and navigation: Core `EmptyState` with Core `Button` starter prompts, and `ChatThreadNav`.

The shell adds layout only: columns, Sheets on small screens and focus return. It has no chat behaviour of its own, so every example here is a composition you can copy.

## Usage

```jsx
import { ChatShell } from '@gaudi/design-system/blocks/Chat';
import { ChatPlan, ChatSessionList, ChatMessageParts, ChatMessageScroller, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport, ChatPromptComposer } from '@gaudi/design-system/chat';

<ChatMessageScrollerProvider autoScroll>
  <ChatShell
    title='Local-first drafts post'
    navigation={<ChatSessionList sessions={sessions} activeId={activeId} onSelect={openChat} onRename={rename} onDelete={remove} />}
    details={<ChatPlan steps={plan} />}
    composer={<ChatPromptComposer status={streaming ? 'streaming' : 'ready'} onSubmit={send} onStop={stop} />}
  >
    <ChatMessageScroller>
      <ChatMessageScrollerViewport aria-label='Conversation'>
        <ChatMessageScrollerContent>
          {turns.map((turn) => (
            <ChatMessageScrollerItem key={turn.id} messageId={turn.id} scrollAnchor={turn.role === 'user'}>
              <ChatMessageParts parts={turn.parts} streaming={turn.streaming} />
            </ChatMessageScrollerItem>
          ))}
        </ChatMessageScrollerContent>
      </ChatMessageScrollerViewport>
    </ChatMessageScroller>
  </ChatShell>
</ChatMessageScrollerProvider>
```

## Parts

| Part | Contract |
| --- | --- |
| `ChatShell` | `variant` page or sidebar. Page shows `navigation`, the thread and `details` side by side from md and xl; below that they open in Sheets from labelled header buttons, which get focus back when the Sheet closes. Sidebar is one column with navigation in a Sheet. `title`, `subtitle`, `headerActions` and `composer` fill the frame; the thread (`children`) owns its scrolling. |

Each part placed in the shell is documented on its own Chat page.

## Session navigation

[Session panel](?path=/story/blocks-chat--session-panel) shows a compact assistant with **History** and **New chat** in its persistent header. History replaces the transcript with `ChatSessionList` inside the panel and hides the composer. **Back to conversation** resumes the current chat; choosing another session opens that session's transcript and saved draft. Search, rename, and delete stay part of the existing session list.

```jsx
import { useState } from 'react';
import { Button } from '@gaudi/design-system';
import { ChatShell } from '@gaudi/design-system/blocks/Chat';
import { ChatSessionList, ChatPromptComposer } from '@gaudi/design-system/chat';

const [historyOpen, setHistoryOpen] = useState(false);
const openChat = (id) => { setActiveId(id); setHistoryOpen(false); };

<ChatShell
  variant='sidebar'
  title={activeSession.title}
  headerActions={<>
    <Button size='xs' variant='ghost' aria-expanded={historyOpen} onClick={() => setHistoryOpen((open) => !open)}>
      {historyOpen ? 'Back to conversation' : 'History'}
    </Button>
    <Button size='xs' variant='ghost' onClick={() => { startChat(); setHistoryOpen(false); }}>New chat</Button>
  </>}
  composer={historyOpen ? null : <ChatPromptComposer value={activeSession.draft} onValueChange={saveDraft} onSubmit={send} />}
>
  {historyOpen ? (
    <div className='min-h-0 flex-1 overflow-y-auto p-3'>
      <ChatSessionList sessions={sessions} activeId={activeSession.id} onSelect={openChat} onRename={renameChat} onDelete={deleteChat} />
    </div>
  ) : conversation}
</ChatShell>
```

Place the state and composition inside the host component. `conversation` is its transcript view; `activeSession` supplies that session's title and draft. Store transcripts and drafts by session ID, and update the controlled session list after rename or deletion. When deleting the active session, choose a remaining chat or create a new one. The shell and session list do not own persistence or message delivery.

[Session page](?path=/story/blocks-chat--session-page) uses the `navigation` slot shown in Usage above. The list sits beside the transcript on larger screens and opens in the shell's existing navigation Sheet on narrow screens. Both layouts use the same `ChatSessionList` owner and host state. Its [primary playground](?path=/story/chat-chatsessionlist--playground) also shows the complete compact chat context.

## Accessibility

The page never scrolls; the thread does, inside a labelled region. While a reply streams, mark it `aria-busy` (ChatMessageParts does this) and announce the start and the end once in a polite status. Never announce every token. Every icon action has a label, and choosing a chat or file in the phone Sheet closes it and returns focus to the button that opened it.

## Workspace context panel

The **Workspace context: agents, files and preview** example places `ChatWorkspace` in `details`. It combines an agent roster, scoped file exploration and a host-owned Dialog preview. Control `view`, `agentId` and file selection above `ChatShell` so desktop and mobile copies share state. The existing shell supplies the mobile details Sheet.

## Welcome composition

**Welcome: orb, input and starter prompts** combines the existing `ChatPersona`, Core EmptyState parts, `ChatPromptComposer`, `ChatModelSelect` and Core `Button`. Choosing a starter fills and focuses the input; submitting calls the host. A compact example shows prompt chips without the orb. These are compositions on this page, with no separate ChatWelcome or ChatPromptSuggestions owner. For follow-ups within a reply, use `ChatMessageParts` with a `suggestions` part and `onSuggestion`.
