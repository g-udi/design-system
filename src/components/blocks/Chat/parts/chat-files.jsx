'use client';
import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { cn } from '../../../../utilities/cn/index.js';
import { Tree, TreeItem, TreeItemLabel } from '../../../core/Tree/parts/tree-extended.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

const fileIcon = (name = '') => {
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(name)) return 'Image';
  if (/\.(csv|xlsx?)$/i.test(name)) return 'FileSpreadsheet';
  if (/\.(js|jsx|ts|tsx|json|css|py|sh)$/i.test(name)) return 'FileCode';
  return 'FileText';
};

/**
 * Files the conversation produced or referenced, on the core Tree with keyboard navigation.
 * `items` is a flat map `{ [id]: { name, children?: id[], meta? } }` under `rootId`; picking a file calls
 * `onSelect(id, item)`.
 */
function ChatFileExplorer({ items, rootId = 'root', defaultExpanded = [], onSelect, label = 'Files', className }) {
  const tree = useTree({
    rootItemId: rootId,
    initialState: { expandedItems: defaultExpanded },
    indent: 16,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    onPrimaryAction: (item) => {
      if (!item.isFolder()) onSelect?.(item.getId(), item.getItemData());
    },
    dataLoader: {
      getItem: (id) => items[id],
      getChildren: (id) => items[id]?.children ?? []
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature]
  });
  return (
    <section data-slot='chat-file-explorer' aria-label={label} className={cn('ds-part-chat-file-explorer grid gap-2', className)}>
      <h2 className='text-sm font-semibold'>{label}</h2>
      <Tree indent={16} tree={tree} aria-label={label}>
        {tree.getItems().map((item) => {
          const data = item.getItemData();
          const folder = item.isFolder();
          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel className='text-sm'>
                <span className='flex min-w-0 items-center gap-2'>
                  <RegistryIcon lucide={folder ? (item.isExpanded() ? 'FolderOpen' : 'Folder') : fileIcon(data.name)} className='text-text-muted size-4 shrink-0' />
                  <span className='truncate'>{item.getItemName()}</span>
                  {data.meta ? <span className='text-text-muted ms-auto shrink-0 text-xs'>{data.meta}</span> : null}
                </span>
              </TreeItemLabel>
            </TreeItem>
          );
        })}
      </Tree>
    </section>
  );
}

export { ChatFileExplorer };
