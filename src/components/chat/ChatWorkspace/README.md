# ChatWorkspace

A context panel for the agents and files around a conversation. An agent's **View files** action opens its folder in `ChatFileExplorer`; **All files** restores the complete hierarchy. `ChatShell` owns responsive placement and mobile sheets.

```jsx
import { ChatWorkspace } from '@gaudi/design-system/chat';

<ChatWorkspace
  agents={[{ id: 'research', name: 'Research', state: 'thinking', description: 'Checking sources', fileRootId: 'research-files' }]}
  fileExplorerProps={{ items, defaultExpanded: ['shared'], selectedId, onSelect, onPreview, onRefresh }}
/>
```

## API

| Prop | Contract |
| --- | --- |
| `agents` | `{ id, name, description?, state?, labels?, fileRootId? }[]`. Stable opaque IDs determine each `ChatAgentMark`. `state` and `labels` use `ChatActivityIndicator`. |
| `fileExplorerProps` | The existing `ChatFileExplorer` props, including `items`, selection, search, actions and recovery states. No second file schema. |
| `view / defaultView / onViewChange` | Controlled or local `files` / `agents` tab. Defaults to `files`. |
| `agentId / defaultAgentId / onAgentChange` | Controlled or local agent scope; `null` means all files. The agent must point to an existing folder, including an empty one. |
| `title / description / actions` | Panel heading, optional supporting text and header actions. |
| `labels` | Override `files`, `agents`, `allFiles`, `viewFiles`, `noAgents`, `noAgentsDescription`, `noAgentFiles`. |
| `className` | Layout integration. The panel has no fixed height or overlay behavior. |

Scope changes reset the explorer's local search and expansion. A missing agent or removed folder falls back to the full tree. The host supplies preview content and file IO through the explorer callbacks. Keep agent permissions, task orchestration and fetching in the application.

When using `ChatShell.details`, control `view`, `agentId` and `fileExplorerProps.selectedId` from the host so the desktop panel and mobile sheet share the current selection. See **Blocks / Chat / Workspace context: agents, files and preview** for a complete example.

## Accessibility

Core Tabs provides tab keyboard navigation. Agent identity and activity have text equivalents. Choosing an agent's files or returning to all files focuses the Files tab; Core Tree owns the explorer's keyboard interaction. Empty agent/file states are explicit.
