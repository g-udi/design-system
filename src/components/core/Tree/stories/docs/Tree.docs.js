import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Tree": {
    ...definition('Browse hierarchical content with expansion, selection, checkboxes and drag feedback.', [p('tree', 'Headless Tree instance', 'Required', 'State and feature configuration returned by useTree.'), p('indent', 'number', '20', 'Indentation per hierarchy level.'), p('toggleIconType', 'chevron | plus-minus', 'chevron', 'Expansion indicator style.'), p('TreeItem.item', 'Headless Tree item instance', 'Required', 'Node state and event bindings.'), p('asChild', 'boolean', 'false', 'Merge the root into a child element.'), children, className], 'Headless Tree supplies hierarchical keyboard navigation. Keep node names stable and announce loading or failed child fetches.'),
    usage: "import { Tree, TreeItem, TreeItemLabel } from '@gaudi/design-system/core/Tree';\n\n// tree is the host's @headless-tree/react useTree instance.\n<Tree tree={tree} aria-label='Project files'>\n  {tree.getItems().map(item => <TreeItem key={item.getId()} item={item}>\n    <TreeItemLabel>{item.getItemName()}</TreeItemLabel>\n  </TreeItem>)}\n</Tree>"
  }
};
