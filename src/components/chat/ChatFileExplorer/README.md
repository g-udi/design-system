# ChatFileExplorer

A conversation’s shared files, uploads, and agent outputs, composed from Core Tree, Input, Button, Badge, Alert, EmptyState, Skeleton, and ChatAgentMark. Hosts supply the file map and own loading, permissions, preview content, and downloads.

## Usage

```jsx
import { ChatFileExplorer } from '@gaudi/design-system/chat';

const files = {
  root: { name: 'Files', children: ['shared', 'researcher'] },
  shared: { name: 'Shared', children: ['brief'] },
  brief: {
    name: 'launch-brief.md', typeLabel: 'MD', sizeLabel: '4.2 KB',
    modifiedLabel: 'Edited 10:40', modifiedAt: '2026-10-03T10:40:00Z',
    downloadUrl: '/files/launch-brief.md'
  },
  researcher: {
    name: 'Researcher', agent: { name: 'Researcher', seed: 'research-agent' },
    children: ['notes']
  },
  notes: { name: 'interview-notes.md', meta: '6 sources' }
};

<ChatFileExplorer
  items={files}
  defaultExpanded={['shared', 'researcher']}
  selectedId={selectedId}
  onSelect={(id, file) => setSelectedId(id)}
  onPreview={(id, file) => openPreview(file)}
  onRefresh={reloadFiles}
/>
```

## Data

`items` remains a flat map by stable string ID. `rootId` identifies its hidden root; `children` defines folder hierarchy and order. Group roots for shared files, uploads, and agents are ordinary folders, so the component needs no second grouping API.

| Item field | Contract |
| --- | --- |
| `name` | File or folder name. Long names truncate with a full-name title. |
| `children?` | Child IDs; even an empty array identifies a folder. |
| `meta?` | Existing short supplementary text, retained for compatibility. |
| `typeLabel?` | Prepared file type. Defaults to the filename extension; an empty string hides it. |
| `sizeLabel?` | Prepared size such as `18 KB`; Gaudi does not reformat it. |
| `modifiedLabel?` / `modifiedAt?` | Prepared time text and optional machine-readable `dateTime`. No polling or relative-time engine. |
| `downloadUrl?` / `downloadName?` | Host-supplied site-relative, HTTP(S), or blob destination and optional saved filename. Unsafe protocols produce no action. |
| `canPreview?` | Set false to omit a file’s explicit Preview action; file selection still works. |
| `agent?` | ChatAgentMark identity props such as `{ name, seed, motif, hue, state }`, used on folders. |

Missing child IDs and repeated/cyclic references are omitted. Input objects are not mutated. Counts cover reachable files; empty folders remain visible and expandable without increasing the file count.

## Props

| Prop | Contract |
| --- | --- |
| `items` / `rootId='root'` | Prepared map and hidden root ID; omitted data shows an empty state. |
| `defaultExpanded=[]` | Normal folder expansion at mount. Core Tree owns subsequent expansion. |
| `selectedId` / `defaultSelectedId=null` | Controlled or initial selected file. Folder focus does not replace file selection. |
| `onSelect(id, item)` | Called on file activation, including repeat activation. Receives the original host item. |
| `onPreview(id, item)` | Adds explicit Preview actions. Preview also selects the file. |
| `searchable=true` | Local search across names, type/size/modified labels, supplementary metadata, and agent names. Matches keep ancestor folders; matching a folder shows its descendants. Clearing search restores normal expansion. |
| `loading` / `refreshing` | Announces busy state and disables refresh/retry. With existing files, keeps the list visible; without them, shows Skeleton rows. |
| `error` / `onRetry` | Error text and retry callback. Existing files remain visible. Retry falls back to `onRefresh` when supplied. |
| `onRefresh` / `actions` | Optional header refresh button and host action slot. |
| `label='Files'` / `className` | Region/tree name and outer layout classes. Place in a bounded flex panel to make its tree scroll internally. |
| `labels` | Overrides `search`, `clearSearch`, `preview`, `download`, `refresh`, `loading`, `errorTitle`, `retry`, `emptyTitle`, `emptyDescription`, `noResultsTitle`, and `noResultsDescription`. |

Downloads use real native anchors with `download`; the host supplies a valid URL and cross-origin download headers where needed. No fetch, file content, permission, polling, or preview implementation is built in.

## Accessibility

Core Tree provides arrows, folder expansion, focus, and Enter activation. Selection is single-file and exposed with `aria-selected`. Preview/download actions are separate controls, available in the focused row’s tab sequence; their keys do not activate the tree row. Search is labelled, updates announce match counts, errors use Alert, and loading announces its state. File actions stay visible for touch users. Rows use non-button treeitems to avoid nested interactive buttons.

When a host update removes the focused row, focus moves to a remaining visible row. An empty replacement focuses the first available panel control, or the labelled panel itself. Updates leave focus in Search and outside controls alone.

## Examples

- **Playground:** grouped shared/upload/agent files, nested search, metadata, preview, genuine local downloads, and refresh.
- **Controlled selection:** host-selected files and a header action.
- **Live file updates:** focus recovery when the host replaces or clears the file map.
- **Empty folders:** folder navigation and search before any files exist.
- **Loading**, **Error and retry**, **Empty:** initial and recovery states.
