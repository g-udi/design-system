# Tree

> Core/Tree · core · `@gaudi/design-system/core/Tree`

Browse hierarchical content with expansion, selection, checkboxes and drag feedback.

## Import

```js
import { Tree } from '@gaudi/design-system/core/Tree';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Tree`, `TreeDragLine`, `TreeItem`, `TreeItemLabel`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `tree` | `Headless Tree instance` | `Required` | no | State and feature configuration returned by useTree. |
| `indent` | `number` | `20` | no | Indentation per hierarchy level. |
| `toggleIconType` | `chevron \| plus-minus` | `chevron` | no | Expansion indicator style. |
| `TreeItem.item` | `Headless Tree item instance` | `Required` | no | Node state and event bindings. |
| `asChild` | `boolean` | `false` | no | Merge the root into a child element. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `toggleIconType`: `chevron`, `plus-minus`

## Usage

```jsx
import { Tree, TreeItem, TreeItemLabel } from '@gaudi/design-system/core/Tree';

// tree is the host's @headless-tree/react useTree instance.
<Tree tree={tree} aria-label='Project files'>
  {tree.getItems().map(item => <TreeItem key={item.getId()} item={item}>
    <TreeItemLabel>{item.getItemName()}</TreeItemLabel>
  </TreeItem>)}
</Tree>
```

## Accessibility

Headless Tree supplies hierarchical keyboard navigation. Keep node names stable and announce loading or failed child fetches.

## Examples

- Playground (Storybook `core-tree--playground`)

Curated patterns:

- Display options — registry item `@gaudi/tree-display-options` (uses `Label`, `RegistryIcon`, `SwitchRoot`, `Tree`, `TreeItem`, `TreeItemLabel`)
- Organization chart — registry item `@gaudi/tree-org-chart` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Tree`, `TreeItem`, `TreeItemLabel`)
- Permission checkboxes — registry item `@gaudi/tree-permissions` (uses `CheckboxRoot`, `Tree`, `TreeItem`, `TreeItemLabel`)

## README

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
