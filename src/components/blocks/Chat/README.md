# Chat

Chat surfaces built from Gaudi parts. `ChatShell` frames a conversation, either as a full page or as a narrow assistant panel beside other work. Around it sit `ChatSessionList` (conversations with rename and delete), `ChatFileExplorer` (files on the core Tree), `ChatPlan` and `ChatActivity` (both on Timeline), `ChatWelcome` (the empty state) and `ChatThreadNav` (step through the prompts).

The turns themselves come from Core: `Message`, `Bubble` and `MessageParts` for replies, `MessageScroller` for the thread, and `PromptComposer` with `PromptQueue` for input.

## Usage

```jsx
import { ChatPlan, ChatSessionList, ChatShell } from '@gaudi/design-system/blocks/Chat';
import { MessageParts, MessageScroller, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport, PromptComposer } from '@gaudi/design-system';

<MessageScrollerProvider autoScroll>
  <ChatShell
    title='Local-first drafts post'
    navigation={<ChatSessionList sessions={sessions} activeId={activeId} onSelect={openChat} onRename={rename} onDelete={remove} />}
    details={<ChatPlan steps={plan} />}
    composer={<PromptComposer status={streaming ? 'streaming' : 'ready'} onSubmit={send} onStop={stop} />}
  >
    <MessageScroller>
      <MessageScrollerViewport aria-label='Conversation'>
        <MessageScrollerContent>
          {turns.map((turn) => (
            <MessageScrollerItem key={turn.id} messageId={turn.id} scrollAnchor={turn.role === 'user'}>
              <MessageParts parts={turn.parts} streaming={turn.streaming} />
            </MessageScrollerItem>
          ))}
        </MessageScrollerContent>
      </MessageScrollerViewport>
    </MessageScroller>
  </ChatShell>
</MessageScrollerProvider>
```

## Parts

| Part | Contract |
| --- | --- |
| `ChatShell` | `variant` page or sidebar. Page shows `navigation`, the thread and `details` side by side from md and xl; below that they open in Sheets from labelled header buttons, which get focus back when the Sheet closes. Sidebar is one column with navigation in a Sheet. `title`, `subtitle`, `headerActions` and `composer` fill the frame; the thread (`children`) owns its scrolling. |
| `ChatSessionList` | `sessions` `{ id, title, preview?, group?, live? }`, grouped and searchable, with `onSelect`, `onNew`, `onRename` (dialog) and `onDelete` (confirmation). The current chat has `aria-current`. |
| `ChatFileExplorer` | `items` as a flat map under `rootId`; folders expand, `onSelect(id, item)` opens a file. |
| `ChatPlan` | `steps` `{ id, title, status, description?, owner?, todos? }`, with a progress summary and collapse. |
| `ChatActivity` | `items` `{ id, title, time, detail?, status?, icon? }`, a neutral history rail. |
| `ChatThreadNav` | `turns`, `current` and `onNavigate`: previous, next and a menu of every prompt. Pair it with `useMessageScroller().scrollToMessage`. |
| `ChatWelcome` | Greeting, description and `suggestions` for a new chat. |

Statuses (pending, running, done, failed, cancelled) are the same vocabulary as `MessageStatus`.

## Accessibility

The page never scrolls; the thread does, inside a labelled region. While a reply streams, mark it `aria-busy` (MessageParts does this) and announce the start and the end once in a polite status. Never announce every token. Every icon action has a label, rename and delete go through dialogs with clear titles, and choosing a chat or file in the phone Sheet closes it and returns focus to the button that opened it.
