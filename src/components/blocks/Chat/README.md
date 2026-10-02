# Chat

`ChatShell` frames a conversation, either as a full page or as a narrow assistant panel beside other work. Everything inside it comes from the Chat area (`@gaudi/design-system/chat`):

- the turns: `Message`, `Bubble`, `MessageParts` and `MessageScroller`;
- the composer: `PromptComposer`, `PromptQueue` and `ChatModelSelect`;
- the side columns: `ChatSessionList`, `ChatFileExplorer`, `ChatPlan` and `ChatActivity`;
- the empty state and navigation: `ChatWelcome` and `ChatThreadNav`.

The shell adds layout only: columns, Sheets on small screens and focus return. It has no chat behaviour of its own, so every example here is a composition you can copy.

## Usage

```jsx
import { ChatShell } from '@gaudi/design-system/blocks/Chat';
import { ChatPlan, ChatSessionList, MessageParts, MessageScroller, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport, PromptComposer } from '@gaudi/design-system/chat';

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

Each part placed in the shell is documented on its own Chat page.

## Accessibility

The page never scrolls; the thread does, inside a labelled region. While a reply streams, mark it `aria-busy` (MessageParts does this) and announce the start and the end once in a polite status. Never announce every token. Every icon action has a label, and choosing a chat or file in the phone Sheet closes it and returns focus to the button that opened it.
