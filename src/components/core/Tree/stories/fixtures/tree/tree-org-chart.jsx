'use client';
import {
  Tree,
  TreeItem,
  TreeItemLabel
} from '@gaudi/design-system/core/Tree';
import { hotkeysCoreFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
const items = {
  company: { name: 'Gaudi Studio', children: ['ceo'] },
  ceo: {
    name: 'Sabine Okafor',
    role: 'CEO',
    avatar: '/avatars/person-20.svg',
    children: ['cto', 'coo', 'cfo']
  },
  cto: {
    name: 'Anouk Varga',
    role: 'CTO',
    avatar: '/avatars/person-41.svg',
    children: ['eng-lead', 'design-lead']
  },
  coo: {
    name: 'Ilse Valtonen',
    role: 'COO',
    avatar: '/avatars/person-24.svg',
    children: ['ops-mgr', 'hr-mgr']
  },
  cfo: {
    name: 'Ottilie Nakamura',
    role: 'CFO',
    avatar: '/avatars/person-50.svg',
    children: ['finance-mgr']
  },
  'eng-lead': {
    name: 'Rafe Okonkwo',
    role: 'Engineering Lead',
    avatar: '/avatars/person-43.svg',
    children: ['dev-1', 'dev-2']
  },
  'design-lead': {
    name: 'Nell Parfitt',
    role: 'Design Lead',
    avatar: '/avatars/person-07.svg'
  },
  'ops-mgr': {
    name: 'Felix Arrowsmith',
    role: 'Operations Manager',
    avatar: '/avatars/person-38.svg'
  },
  'hr-mgr': {
    name: 'Margit Solberg',
    role: 'HR Manager',
    avatar: '/avatars/person-19.svg'
  },
  'finance-mgr': {
    name: 'Rufus Davenport',
    role: 'Finance Manager',
    avatar: '/avatars/person-49.svg'
  },
  'dev-1': {
    name: 'Tamsin Harrow',
    role: 'Senior Developer',
    avatar: '/avatars/person-35.svg'
  },
  'dev-2': {
    name: 'Niamh Prasad',
    role: 'Developer',
    avatar: '/avatars/person-22.svg'
  }
};
const indent = 24;
export function Pattern() {
  const tree = useTree({
    initialState: {
      expandedItems: ['ceo', 'cto']
    },
    indent,
    rootItemId: 'company',
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? []
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature]
  });
  return (
    <div className='mx-auto w-full grow place-self-start lg:w-xs'>
      <Tree indent={indent} tree={tree}>
        {tree.getItems().map((item) => {
          const data = item.getItemData();
          const initials = data.name
            .split(' ')
            .map((n) => n[0])
            .join('');
          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel className='gap-2 py-1'>
                <Avatar className='size-6 shrink-0'>
                  <AvatarImage src={data.avatar} alt={data.name} />
                  <AvatarFallback>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className='flex flex-col items-start'>
                  <span className='text-sm leading-tight'>{data.name}</span>
                  {data.role && (
                    <span className='text-ui-muted-foreground text-xs leading-tight'>
                      {data.role}
                    </span>
                  )}
                </span>
              </TreeItemLabel>
            </TreeItem>
          );
        })}
      </Tree>
    </div>
  );
}
