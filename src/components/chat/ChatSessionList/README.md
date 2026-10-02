# ChatSessionList

Past conversations grouped by day or week, with search, a new-chat action, and rename and delete per row.

## Usage

```jsx
import { ChatSessionList } from '@gaudi/design-system/chat';

<ChatSessionList sessions={sessions} activeId={activeId} onSelect={setActiveId} onNew={startChat} onRename={rename} onDelete={remove} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `sessions` | `{ id, title, preview?, updated?, group?, live? }`. |
| `activeId` / `onSelect` | The current chat (`aria-current`) and selection. |
| `onNew` / `onRename` / `onDelete` | New chat, rename in a dialog, delete after a confirmation. |
| `searchable` / `labels` | Search box and copy. |

## Accessibility

Rows are links or buttons with the current one marked; each row menu is named after the chat, and rename and delete go through dialogs with clear titles.
