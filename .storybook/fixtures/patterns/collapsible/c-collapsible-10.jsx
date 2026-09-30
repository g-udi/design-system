'use client';
import { useRef, useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardHeader
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import {
  Item,
  ItemActions,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '../../../../src/components/core/Tabs/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const fileTree = [
  {
    name: 'components',
    items: [
      {
        name: 'ui',
        items: [
          { name: 'button.tsx' },
          { name: 'card.tsx' },
          { name: 'dialog.tsx' }
        ]
      },
      { name: 'login-form.tsx' }
    ]
  },
  {
    name: 'lib',
    items: [{ name: 'utils.ts' }, { name: 'api.ts' }]
  },
  {
    name: 'hooks',
    items: [{ name: 'use-debounce.ts' }, { name: 'use-local-storage.ts' }]
  },
  { name: 'app.tsx' },
  { name: 'package.json' }
];
function TreeItem({ item, level = 0, selectedId, onSelect, onDelete }) {
  const isFolder = 'items' in item;
  const isSelected = selectedId === item.name;
  if (isFolder) {
    return (
      <Collapsible className='group/collapsible'>
        <CollapsibleTrigger asChild>
          <Item
            as='button'
            type='button'
            size='xs'
            className='group/folder-trigger hover:bg-surface-muted data-[state=open]:bg-surface-muted h-8 min-w-0 flex-nowrap rounded-none cursor-pointer py-0.5'
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            <ItemMedia variant='icon'>
              <RegistryIcon
                lucide='ChevronRightIcon'
                aria-hidden='true'
                className='text-text-muted size-3 transition-transform group-data-[state=open]/folder-trigger:rotate-90'
              />
              <RegistryIcon
                lucide='FolderIcon'
                aria-hidden='true'
                className='text-text-muted group-hover/item:text-text size-3.5'
              />
            </ItemMedia>
            <ItemTitle className='min-w-0 truncate text-sm'>{item.name}</ItemTitle>
          </Item>
        </CollapsibleTrigger>
        <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden pt-0.5'>
          <div className='flex flex-col gap-0.5'>
            {item.items.map((child) => (
              <TreeItem
                key={child.name}
                item={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
  return (
    <Item
      size='xs'
      className='group/item hover:bg-surface-muted data-[active=true]:bg-accent-subtle h-8 min-w-0 flex-nowrap rounded-none py-0.5'
      data-active={isSelected}
      style={{ paddingLeft: `${level * 12 + 8}px` }}
    >
      <ItemMedia variant='icon' className='ps-5'>
        <RegistryIcon
          lucide='FileIcon'
          aria-hidden='true'
          className='text-text-muted group-hover/item:text-text group-data-[active=true]/item:text-text size-3.5'
        />
      </ItemMedia>
      <button
        type='button'
        className='min-w-0 flex-1 self-stretch truncate text-start text-sm'
        title={item.name}
        aria-pressed={isSelected}
        onClick={() => onSelect?.(item.name)}
      >
        {item.name}
      </button>
      <ItemActions className='-mr-1 ml-auto shrink-0 gap-0 opacity-0 transition-opacity group-hover/item:opacity-100 group-focus-within/item:opacity-100 group-data-[active=true]/item:opacity-100 pointer-coarse:opacity-100'>
        <Button asChild aria-label={`Download ${item.name}`} size='icon-xs' variant='ghost'>
          <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(`// Demo file: ${item.name}\n`)}`} download={item.name}>
            <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />
          </a>
        </Button>
        <Button aria-label={`Delete ${item.name}`} variant='ghost' size='icon-xs' onClick={() => onDelete(item.name)}>
          <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
        </Button>
      </ItemActions>
    </Item>
  );
}
function removeFile(items, name) {
  return items.filter((item) => item.items || item.name !== name).map((item) => (
    item.items ? { ...item, items: removeFile(item.items, name) } : item
  ));
}
export function Pattern() {
  const explorerRef = useRef(null);
  const [items, setItems] = useState(fileTree);
  const [selectedId, setSelectedId] = useState(null);
  const [removedFile, setRemovedFile] = useState(null);
  function handleDelete(name) {
    setItems((previous) => removeFile(previous, name));
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
              {items.map((item) => (
                <TreeItem
                  key={item.name}
                  item={item}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onDelete={handleDelete}
                />
              ))}
            </TabsContent>
            <TabsContent value='outline' className='p-2'>
              <p className='text-sm text-text-muted'>
                {selectedId ? `${selectedId} has no symbols in this demo.` : 'Select a file to view its outline.'}
              </p>
            </TabsContent>
          </CardContent>
          {removedFile && (
            <div className='flex min-w-0 items-center justify-between gap-2 border-t border-border px-2 py-1 text-xs'>
              <span role='status' className='min-w-0 truncate'>{removedFile} removed.</span>
              <Button size='xs' variant='subtle' className='shrink-0' onClick={() => {
                setItems(fileTree);
                setRemovedFile(null);
                explorerRef.current?.focus();
              }}>Restore files</Button>
            </div>
          )}
        </Card>
      </Tabs>
    </div>
  );
}
