'use client';
import { useState } from 'react';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import { CascaderItems } from '../../../../src/components/core/Cascader/parts/cascader-item-extended.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const folderIcon = <RegistryIcon lucide='FolderIcon' aria-hidden='true' />;
const fileIcon = <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />;
const tree = [
  {
    value: 'app',
    label: 'app',
    icon: folderIcon,
    children: [
      {
        value: 'app/dashboard',
        label: 'dashboard',
        icon: folderIcon,
        children: [
          {
            value: 'app/dashboard/page.tsx',
            label: 'page.tsx',
            icon: fileIcon
          },
          {
            value: 'app/dashboard/layout.tsx',
            label: 'layout.tsx',
            icon: fileIcon
          }
        ]
      },
      {
        value: 'app/settings',
        label: 'settings',
        icon: folderIcon,
        children: [
          { value: 'app/settings/page.tsx', label: 'page.tsx', icon: fileIcon },
          {
            value: 'app/settings/billing.tsx',
            label: 'billing.tsx',
            icon: fileIcon
          }
        ]
      },
      { value: 'app/layout.tsx', label: 'layout.tsx', icon: fileIcon }
    ]
  },
  {
    value: 'components',
    label: 'components',
    icon: folderIcon,
    children: [
      { value: 'components/button.tsx', label: 'button.tsx', icon: fileIcon },
      {
        value: 'components/page-header.tsx',
        label: 'page-header.tsx',
        icon: fileIcon
      },
      {
        value: 'components/data-table.tsx',
        label: 'data-table.tsx',
        icon: fileIcon
      }
    ]
  },
  {
    value: 'hooks',
    label: 'hooks',
    icon: folderIcon,
    children: [
      { value: 'hooks/use-user.ts', label: 'use-user.ts', icon: fileIcon },
      { value: 'hooks/use-toast.ts', label: 'use-toast.ts', icon: fileIcon }
    ]
  },
  {
    value: 'lib',
    label: 'lib',
    icon: folderIcon,
    children: [
      { value: 'lib/utils.ts', label: 'utils.ts', icon: fileIcon },
      { value: 'lib/auth.ts', label: 'auth.ts', icon: fileIcon },
      { value: 'lib/db.ts', label: 'db.ts', icon: fileIcon }
    ]
  },
  {
    value: 'server',
    label: 'server',
    icon: folderIcon,
    children: [
      {
        value: 'server/actions',
        label: 'actions',
        icon: folderIcon,
        children: [
          {
            value: 'server/actions/billing.ts',
            label: 'billing.ts',
            icon: fileIcon
          },
          {
            value: 'server/actions/invite.ts',
            label: 'invite.ts',
            icon: fileIcon
          }
        ]
      },
      { value: 'server/client.ts', label: 'client.ts', icon: fileIcon }
    ]
  },
  {
    value: 'styles',
    label: 'styles',
    icon: folderIcon,
    children: [
      { value: 'styles/globals.css', label: 'globals.css', icon: fileIcon },
      { value: 'styles/theme.css', label: 'theme.css', icon: fileIcon }
    ]
  },
  {
    value: 'tests',
    label: 'tests',
    icon: folderIcon,
    children: [
      { value: 'tests/auth.test.ts', label: 'auth.test.ts', icon: fileIcon },
      {
        value: 'tests/billing.test.ts',
        label: 'billing.test.ts',
        icon: fileIcon
      }
    ]
  },
  {
    value: 'scripts',
    label: 'scripts',
    icon: folderIcon,
    children: [
      { value: 'scripts/seed.ts', label: 'seed.ts', icon: fileIcon },
      { value: 'scripts/build.ts', label: 'build.ts', icon: fileIcon }
    ]
  }
];
export function Pattern() {
  const [value, setValue] = useState('');
  return (
    <div className='flex w-full flex-col items-center gap-3 p-4'>
      <Cascader
        items={tree}
        value={value}
        onValueChange={setValue}
        searchScope='deep'
      >
        <CascaderTrigger
          aria-label='File'
          render={
            <Button
              variant='outline'
              className='w-72 justify-between gap-2 font-normal'
            />
          }
        >
          <CascaderValue placeholder='Find a file' maxSegments={3} />
        </CascaderTrigger>

        <CascaderContent className='w-80'>
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput placeholder='Search all files...' />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  );
}
