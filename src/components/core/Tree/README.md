# Tree

An expandable hierarchy such as a file explorer, an org chart or nested permissions. Use it when readers need to open branches and pick items; use `Accordion` for a flat list of sections.

```jsx
import { useTree } from '@headless-tree/react';
import { selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { Tree, TreeItem, TreeItemLabel } from '@gaudi/design-system';

const tree = useTree({ rootItemId: 'root', dataLoader, getItemName, isItemFolder, features: [syncDataLoaderFeature, selectionFeature] });

<Tree tree={tree} indent={20}>
  {tree.getItems().map((item) => (
    <TreeItem key={item.getId()} item={item}>
      <TreeItemLabel />
    </TreeItem>
  ))}
</Tree>
```

Headless Tree owns state, selection and keyboard navigation (arrows, Home/End, type-ahead); Gaudi renders the rows. `indent` spaces each level, `toggleIconType` switches the folder chevron for plus and minus, and `TreeDragLine` shows the drop position while dragging. Keep item names stable and announce loading or failed child fetches.
