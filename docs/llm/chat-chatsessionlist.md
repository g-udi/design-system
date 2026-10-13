# ChatSessionList

> Chat/ChatSessionList · chat · `@gaudi/design-system/chat/ChatSessionList`

Session navigation inside a complete chat: grouped conversations with title search, new chat, rename and delete. The compact panel opens History in place of the transcript; the full-page composition uses ChatShell navigation and its narrow-screen Sheet. The host keeps a separate transcript and draft for each session.

## Import

```js
import ChatSessionList from '@gaudi/design-system/chat/ChatSessionList';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatSessionList`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `searchable` | `boolean` | `true` | no | Search box. |
| `sessions` | `Array<{ id, title, preview?, updated?, group?, live? }>` | `[]` | no | Conversations, grouped by group. |
| `activeId` | `string` | — | no | Current chat and selection. |
| `onSelect` | `function` | — | no | Current chat and selection. |
| `onNew / onRename / onDelete` | `function` | — | no | New chat, rename dialog, delete confirmation. |
| `className` | `string` | — | no | Additional classes on the outer element. |

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

## Accessibility

The current chat has aria-current; row menus are named after each chat, and rename and delete use labelled dialogs. In the compact composition, History and New chat remain in the header while history hides the composer; Back to conversation or session selection resumes the transcript. The page navigation Sheet closes after selection and returns focus to its opener.

## Examples

- Session history in a full chat panel (Storybook `chat-chatsessionlist--playground`)

## Related

`core-sheet`

## README

Past conversations grouped by day or week, with title search, current-session selection, a new-chat action, and rename and delete dialogs. Compose the list inside a chat so choosing a session opens its transcript and draft.

### Usage

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

### API

| Prop / part | Contract |
| --- | --- |
| `sessions` | `{ id, title, preview?, updated?, group?, live? }`. |
| `activeId` / `onSelect(id)` | Host-controlled current chat (`aria-current`) and selection callback. |
| `onNew()` / `onRename(id, title)` / `onDelete(id)` | Host callbacks for new chat, a confirmed rename, and confirmed deletion. Only supplied actions appear. |
| `searchable=true` / `labels` | Local title search and interface copy overrides. |

### Accessibility

Rows are buttons with the current one marked; each row menu is named after the chat, and rename and delete go through dialogs with clear titles. The full-page shell closes its narrow-screen navigation Sheet after session selection and returns focus to the opener. The compact composition keeps History and New chat available in the header.

### Examples

- [ChatSessionList playground](?path=/story/chat-chatsessionlist--playground): the list inside a compact conversation panel, with search, selection, rename, deletion, and separate session drafts.
- [Blocks/Chat · Session panel](?path=/story/blocks-chat--session-panel): the compact History / Back to conversation flow and header New chat action.
- [Blocks/Chat · Session page](?path=/story/blocks-chat--session-page): full-page navigation beside the conversation, using the existing Sheet on narrow screens.
