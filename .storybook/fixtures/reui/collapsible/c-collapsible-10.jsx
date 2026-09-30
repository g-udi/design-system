// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
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
function TreeItem({ item, level = 0, selectedId, onSelect }) {
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
            className='hover:bg-ui-accent data-[state=open]:bg-ui-accent cursor-pointer py-1.5'
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            <ItemMedia variant='icon'>
              <RegistryIcon
                lucide='ChevronRightIcon'
                aria-hidden='true'
                className='text-ui-muted-foreground size-3 transition-transform in-data-[state=open]:rotate-90'
              />
              <RegistryIcon
                lucide='FolderIcon'
                aria-hidden='true'
                className='text-ui-muted-foreground group-hover/item:text-ui-foreground size-3.5'
              />
            </ItemMedia>
            <ItemTitle className='text-sm'>{item.name}</ItemTitle>
          </Item>
        </CollapsibleTrigger>
        <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden pt-0.5'>
          <div className='flex flex-col gap-0.5 ps-1.5'>
            {item.items.map((child) => (
              <TreeItem
                key={child.name}
                item={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
  return (
    <Item
      className='group/item hover:bg-ui-accent data-[active=true]:bg-ui-accent cursor-pointer py-1.5'
      data-active={isSelected}
      style={{ paddingLeft: `${level * 12 + 9}px` }}
    >
      <ItemMedia variant='icon'>
        <RegistryIcon
          lucide='FileIcon'
          aria-hidden='true'
          className='text-ui-muted-foreground group-hover/item:text-ui-foreground group-data-[active=true]/item:text-ui-foreground size-4'
        />
      </ItemMedia>
      <button
        type='button'
        className='text-sm text-start flex-1'
        onClick={() => onSelect?.(item.name)}
      >
        {item.name}
      </button>
      <ItemActions className='-mr-2 ml-auto gap-0 opacity-0 transition-opacity group-hover/item:opacity-100 group-data-[active=true]/item:opacity-100'>
        <Button aria-label='Download' size='icon-xs' variant='ghost'>
          <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />
        </Button>
        <Button aria-label='Delete' variant='ghost' size='icon-xs'>
          <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
        </Button>
      </ItemActions>
    </Item>
  );
}
export function Pattern() {
  const [selectedId, setSelectedId] = useState(null);
  return (
    <div className='min-h-64 w-72'>
      <Tabs defaultValue='explorer'>
        <Card size='sm' className='gap-1 p-1'>
          <CardHeader className='p-0'>
            <TabsList className='bg-ui-accent h-8 w-full p-1'>
              <TabsTrigger value='explorer' className='text-xs'>
                Explorer
              </TabsTrigger>
              <TabsTrigger value='outline' className='text-xs'>
                Outline
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className='p-0'>
            <TabsContent value='explorer' className='flex flex-col gap-0.5'>
              {fileTree.map((item) => (
                <TreeItem
                  key={item.name}
                  item={item}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              ))}
            </TabsContent>
            <TabsContent value='outline'>
              <p className='p-3 text-sm text-ui-muted-foreground'>
                Select a file to view its outline.
              </p>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
