import { useId } from 'react';
import { useTree } from '@headless-tree/react';
import { syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature } from '@headless-tree/core';
import { Tree, TreeItem, TreeItemLabel } from '@gaudi/design-system/core/Tree';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const files = {
  root: { name: 'Project', children: ['src', 'docs', 'package'] },
  src: { name: 'src', children: ['components', 'hooks', 'index'] },
  components: { name: 'components', children: ['button', 'tree', 'styles'] },
  button: { name: 'Button.jsx', status: 'M' },
  tree: { name: 'Tree.jsx', status: 'A' },
  styles: { name: 'Tree.css', status: 'M' },
  hooks: { name: 'hooks', children: ['useTree'] },
  useTree: { name: 'useTree.js' },
  index: { name: 'index.js' },
  docs: { name: 'docs', children: ['readme', 'changelog'] },
  readme: { name: 'README.md' },
  changelog: { name: 'CHANGELOG.md', status: 'M' },
  package: { name: 'package.json', status: 'M' }
};

const fileIcons = {
  jsx: ['FileCodeIcon', 'text-info'],
  js: ['FileCodeIcon', 'text-warning'],
  css: ['PaletteIcon', 'text-ui-primary'],
  md: ['FileTextIcon', 'text-ui-muted-foreground'],
  json: ['FileJsonIcon', 'text-success']
};

const statuses = {
  M: { label: 'modified', className: 'text-warning' },
  A: { label: 'added', className: 'text-success' }
};

function ItemIcon({ item }) {
  if (item.isFolder()) {
    return <RegistryIcon lucide={item.isExpanded() ? 'FolderOpenIcon' : 'FolderIcon'} aria-hidden='true' className='size-4 text-ui-muted-foreground' />;
  }
  const [icon, tone] = fileIcons[item.getItemName().split('.').pop()];
  return <RegistryIcon lucide={icon} aria-hidden='true' className={`size-4 ${tone}`} />;
}

function TreeExample({ indent, toggleIconType }) {
  const prefix = useId();
  const tree = useTree({
    rootItemId: 'root',
    initialState: { expandedItems: ['src', 'components', 'hooks'], selectedItems: ['tree'] },
    indent,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => Boolean(item.getItemData().children),
    dataLoader: { getItem: (id) => files[id], getChildren: (id) => files[id].children ?? [] },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature]
  });
  return (
    <Tree
      tree={tree}
      indent={indent}
      toggleIconType={toggleIconType}
      className='relative before:absolute before:inset-0 before:-ms-1.25 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]'
    >
      {tree.getItems().map((item) => {
        const status = statuses[item.getItemData().status];
        // headless-tree names each item after its file, so the git status is exposed as the description.
        const statusId = status ? `${prefix}-${item.getId()}` : undefined;
        return (
          <TreeItem key={item.getId()} item={item} aria-describedby={statusId}>
            <TreeItemLabel className='before:bg-ui-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10'>
              <span className='ms-1 flex min-w-0 flex-1 items-center gap-2'>
                <ItemIcon item={item} />
                <span className='truncate'>{item.getItemName()}</span>
                {status && (
                  <span className={`ms-auto font-mono text-xs font-semibold ${status.className}`}>
                    <span aria-hidden='true'>{item.getItemData().status}</span>
                    <span id={statusId} className='sr-only'>{status.label}</span>
                  </span>
                )}
              </span>
            </TreeItemLabel>
          </TreeItem>
        );
      })}
    </Tree>
  );
}

export const exampleDefaults = { indent: 20, toggleIconType: 'chevron' };

export function PlaygroundDemo(props) {
  const args = { ...exampleDefaults, ...props };
  return <TreeExample {...args} />;
}
