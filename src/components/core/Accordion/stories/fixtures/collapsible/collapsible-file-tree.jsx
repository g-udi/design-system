'use client';
import { useEffect, useRef, useState } from 'react';
import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { Tree, TreeItem, TreeItemLabel } from '@gaudi/design-system/core/Tree';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardFooter,
  CardRoot as Card,
  CardContent,
  CardHeader
} from '@gaudi/design-system/core/Card';
import { Collapsible, CollapsibleContent } from '@gaudi/design-system/core/Accordion';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@gaudi/design-system/core/Tabs';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const folders = {
  root: ['components', 'lib', 'hooks', 'app.tsx', 'package.json'],
  components: ['ui', 'login-form.tsx'],
  ui: ['button.tsx', 'card.tsx', 'dialog.tsx'],
  lib: ['utils.ts', 'api.ts'],
  hooks: ['use-debounce.ts', 'use-local-storage.ts']
};
const activateRow = (_event, tree) => tree.getFocusedItem()?.getElement()?.click();
const keys = {
  activateRow: { hotkey: 'Enter', preventDefault: true, handler: activateRow },
  selectRow: { hotkey: 'Space', preventDefault: true, handler: activateRow }
};
export function Pattern() {
  const explorerRef = useRef(null);
  const [removed, setRemoved] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [removedFile, setRemovedFile] = useState(null);
  const tree = useTree({
    rootItemId: 'root',
    hotkeys: keys,
    state: { selectedItems: selectedId ? [selectedId] : [] },
    setSelectedItems: () => {},
    getItemName: (item) => item.getId(),
    isItemFolder: (item) => Object.hasOwn(folders, item.getId()),
    onPrimaryAction: (item) => { if (!item.isFolder()) setSelectedId(item.getId()); },
    dataLoader: {
      getItem: (id) => id,
      getChildren: (id) => (folders[id] || []).filter((name) => !removed.includes(name))
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature]
  });
  useEffect(() => { tree.rebuildTree(); }, [removed, tree]);
  function handleDelete(name) {
    setRemoved((previous) => [...previous, name]);
    setSelectedId((previous) => previous === name ? null : previous);
    setRemovedFile(name);
    explorerRef.current?.focus();
  }
  return (
    <div className='mx-auto w-full max-w-72'>
      <Tabs defaultValue='explorer'>
        <Card size='sm' className='gap-0 rounded-none p-0'>
          <CardHeader className='rounded-none p-0'>
            <TabsList aria-label='File explorer views' className='bg-surface-muted min-h-8 w-full px-1'>
              <TabsTrigger ref={explorerRef} value='explorer' className='text-sm'>
                Explorer
              </TabsTrigger>
              <TabsTrigger value='outline' className='text-sm'>
                Outline
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className='p-1'>
            <TabsContent value='explorer' className='flex flex-col gap-0.5 p-0'>
              <Tree tree={tree} indent={12} aria-label='Project files'>
                {tree.getItems().map((item) => {
                  const name = item.getId();
                  const folder = item.isFolder();
                  return (
                    <TreeItem item={item} key={name} asChild>
                      <div aria-label={name} className='group/file-row min-w-0' onFocus={() => item.setFocused()}>
                        <TreeItemLabel className='min-h-8 min-w-0 gap-1'>
                          <RegistryIcon lucide={folder ? 'FolderIcon' : 'FileIcon'} aria-hidden='true' className='size-3.5 text-text-muted' />
                          <span className='min-w-0 flex-1 truncate text-start'>{name}</span>
                          {!folder && (
                            <span className='flex shrink-0 opacity-0 group-hover/file-row:opacity-100 group-focus-within/file-row:opacity-100 group-data-[selected=true]/file-row:opacity-100 pointer-coarse:opacity-100' onClick={(event) => event.stopPropagation()} onKeyDownCapture={(event) => event.stopPropagation()}>
                              <Button asChild aria-label={`Download ${name}`} size='icon-xs' variant='ghost'>
                                <a tabIndex={item.isFocused() ? 0 : -1} href={`data:text/plain;charset=utf-8,${encodeURIComponent(`// Demo file: ${name}\n`)}`} download={name}>
                                  <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />
                                </a>
                              </Button>
                              <Button aria-label={`Delete ${name}`} tabIndex={item.isFocused() ? 0 : -1} variant='ghost' size='icon-xs' onClick={() => handleDelete(name)}>
                                <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
                              </Button>
                            </span>
                          )}
                        </TreeItemLabel>
                      </div>
                    </TreeItem>
                  );
                })}
              </Tree>
            </TabsContent>
            <TabsContent value='outline' className='p-2'>
              <p className='text-sm text-text-muted'>
                {selectedId ? `${selectedId} has no symbols in this demo.` : 'Select a file to view its outline.'}
              </p>
            </TabsContent>
          </CardContent>
          <Collapsible open={Boolean(removedFile)}>
            <CollapsibleContent asChild>
              <CardFooter className='flex min-w-0 items-center justify-between gap-2 border-t border-border px-2 py-1 text-xs'>
                <span role='status' className='min-w-0 truncate'>{removedFile} removed.</span>
                <Button size='xs' variant='subtle' className='shrink-0' onClick={() => {
                  setRemoved([]);
                  setRemovedFile(null);
                  explorerRef.current?.focus();
                }}>Restore files</Button>
              </CardFooter>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </Tabs>
    </div>
  );
}
