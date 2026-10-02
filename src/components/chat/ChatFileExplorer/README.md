# ChatFileExplorer

The files a conversation produced or uses, on the core Tree.

## Usage

```jsx
import { ChatFileExplorer } from '@gaudi/design-system/chat';

<ChatFileExplorer items={files} defaultExpanded={['drafts']} onSelect={(id, file) => open(file)} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `items` / `rootId` | A flat map of `{ name, children?, meta? }` by id. |
| `defaultExpanded` | Folders open at first. |
| `onSelect(id, item)` | Opens a file; folders expand instead. |
| `label` | Names the region and the tree. |

## Accessibility

Arrow keys move and open folders, Enter opens a file. The tree is labelled.
