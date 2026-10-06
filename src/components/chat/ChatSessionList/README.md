# ChatSessionList

Past conversations grouped by day or week, with title search, current-session selection, a new-chat action, and rename and delete dialogs. Compose the list inside a chat so choosing a session opens its transcript and draft.

## Usage

```jsx
import { ChatShell } from '@gaudi/design-system/blocks/Chat';
import { ChatSessionList, ChatMessageParts, ChatPromptComposer } from '@gaudi/design-system/chat';

<ChatShell
  title={activeSession.title}
  navigation={
    <ChatSessionList
      sessions={sessions}
      activeId={activeSession.id}
      onSelect={openChat}
      onNew={startChat}
      onRename={renameChat}
      onDelete={deleteChat}
    />
  }
  composer={<ChatPromptComposer value={activeSession.draft} onValueChange={saveDraft} onSubmit={send} />}
>
  <div role='region' aria-label='Conversation' tabIndex={0} className='min-h-0 flex-1 overflow-y-auto p-4'>
    {activeSession.turns.map((turn) => <ChatMessageParts key={turn.id} parts={turn.parts} />)}
  </div>
</ChatShell>
```

The host owns `sessions`, the active ID, and each session's transcript and draft. Selection changes the active ID; rename updates that session's title; deletion removes it and chooses a remaining session or starts a new one if necessary. Keep drafts keyed by session ID so switching chats does not carry text into another conversation. Search filters the supplied titles locally and does not change the active session.

For a compact assistant panel, keep the shell header visible and use its **History** action to replace the conversation with this list. Hide the composer while browsing history; **Back to conversation** or selecting a session restores it. Keep **New chat** in the header. This is a `ChatShell` composition, with no additional public wrapper. The full-page layout uses the shell's `navigation` slot; on narrow screens the existing navigation Sheet contains the list.

## API

| Prop / part | Contract |
| --- | --- |
| `sessions` | `{ id, title, preview?, updated?, group?, live? }`. |
| `activeId` / `onSelect(id)` | Host-controlled current chat (`aria-current`) and selection callback. |
| `onNew()` / `onRename(id, title)` / `onDelete(id)` | Host callbacks for new chat, a confirmed rename, and confirmed deletion. Only supplied actions appear. |
| `searchable=true` / `labels` | Local title search and interface copy overrides. |

## Accessibility

Rows are buttons with the current one marked; each row menu is named after the chat, and rename and delete go through dialogs with clear titles. The full-page shell closes its narrow-screen navigation Sheet after session selection and returns focus to the opener. The compact composition keeps History and New chat available in the header.

## Examples

- [ChatSessionList playground](?path=/story/chat-chatsessionlist--playground): the list inside a compact conversation panel, with search, selection, rename, deletion, and separate session drafts.
- [Blocks/Chat · Session panel](?path=/story/blocks-chat--session-panel): the compact History / Back to conversation flow and header New chat action.
- [Blocks/Chat · Session page](?path=/story/blocks-chat--session-page): full-page navigation beside the conversation, using the existing Sheet on narrow screens.
