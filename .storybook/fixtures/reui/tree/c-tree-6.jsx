// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import {
  Tree,
  TreeItem,
  TreeItemLabel
} from '../../../../src/components/core/Tree/parts/tree-extended.jsx';
import { hotkeysCoreFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
const items = {
  company: { name: 'Acme Inc.', children: ['ceo'] },
  ceo: {
    name: 'Sarah Chen',
    role: 'CEO',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    children: ['cto', 'coo', 'cfo']
  },
  cto: {
    name: 'Alex Johnson',
    role: 'CTO',
    avatar:
      'static/images/art/10.svg',
    children: ['eng-lead', 'design-lead']
  },
  coo: {
    name: 'Emma Wilson',
    role: 'COO',
    avatar:
      'static/images/art/1.svg',
    children: ['ops-mgr', 'hr-mgr']
  },
  cfo: {
    name: 'David Kim',
    role: 'CFO',
    avatar:
      'static/images/art/9.svg',
    children: ['finance-mgr']
  },
  'eng-lead': {
    name: 'Michael Rodriguez',
    role: 'Engineering Lead',
    avatar:
      'static/images/art/5.svg',
    children: ['dev-1', 'dev-2']
  },
  'design-lead': {
    name: 'Lisa Park',
    role: 'Design Lead',
    avatar:
      'static/images/art/11.svg'
  },
  'ops-mgr': {
    name: 'James Brown',
    role: 'Operations Manager',
    avatar:
      'static/images/art/4.svg'
  },
  'hr-mgr': {
    name: 'Amy Taylor',
    role: 'HR Manager',
    avatar:
      'static/images/art/2.svg'
  },
  'finance-mgr': {
    name: 'Robert Davis',
    role: 'Finance Manager',
    avatar:
      'static/images/art/9.svg'
  },
  'dev-1': {
    name: 'Tom Harris',
    role: 'Senior Developer',
    avatar:
      'static/images/art/5.svg'
  },
  'dev-2': {
    name: 'Nina Patel',
    role: 'Developer',
    avatar:
      'static/images/art/6.svg'
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
                  <AvatarFallback className='text-xs'>
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
