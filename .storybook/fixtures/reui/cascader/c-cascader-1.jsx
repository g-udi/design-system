// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
const textIcon = <RegistryIcon lucide='TypeIcon' className='size-4' />;
const hashIcon = <RegistryIcon lucide='HashIcon' className='size-4' />;
const usersIcon = <RegistryIcon lucide='UsersIcon' className='size-4' />;
const mailIcon = <RegistryIcon lucide='AtSignIcon' className='size-4' />;
const checkIcon = <RegistryIcon lucide='SquareCheckIcon' className='size-4' />;
const clockIcon = (
  <RegistryIcon lucide='CalendarClockIcon' className='size-4' />
);
const userIcon = <RegistryIcon lucide='UserIcon' className='size-4' />;
const attributes = [
  { value: 'record-id', label: 'Record ID', icon: hashIcon },
  {
    value: 'person',
    label: 'Person',
    icon: usersIcon,
    count: 24,
    children: [
      { value: 'person.name', label: 'Name', icon: textIcon },
      {
        value: 'person.email',
        label: 'Email addresses',
        icon: mailIcon,
        keywords: ['mail']
      },
      { value: 'person.title', label: 'Job title', icon: textIcon },
      {
        value: 'person.company',
        label: 'Company',
        icon: usersIcon,
        count: 8,
        children: [
          {
            value: 'person.company.name',
            label: 'Company name',
            icon: textIcon
          },
          { value: 'person.company.domain', label: 'Domain', icon: textIcon },
          {
            value: 'person.company.employees',
            label: 'Employees',
            icon: hashIcon
          }
        ]
      }
    ]
  },
  {
    value: 'email',
    label: 'Primary email address',
    icon: mailIcon,
    keywords: ['mail']
  },
  { value: 'user-id', label: 'User ID', icon: textIcon },
  {
    value: 'workspaces',
    label: 'Workspaces',
    icon: usersIcon,
    count: 9,
    children: [
      { value: 'workspaces.name', label: 'Name', icon: textIcon },
      { value: 'workspaces.plan', label: 'Plan', icon: textIcon },
      { value: 'workspaces.seats', label: 'Seats', icon: hashIcon }
    ]
  },
  {
    value: 'next-task',
    label: 'Next due task',
    icon: checkIcon,
    count: 1,
    children: [{ value: 'next-task.due', label: 'Due date', icon: clockIcon }]
  },
  { value: 'created-at', label: 'Created at', icon: clockIcon },
  { value: 'created-by', label: 'Created by', icon: userIcon }
];
export function Pattern() {
  const [value, setValue] = useState('');
  return (
    <div className='flex w-full justify-center p-4'>
      <Cascader items={attributes} value={value} onValueChange={setValue}>
        <CascaderTrigger
          aria-label='Attribute'
          render={
            <Button
              variant='outline'
              className='w-72 justify-between gap-2 font-normal'
            />
          }
        >
          <CascaderValue placeholder='Select an attribute' maxSegments={3} />
        </CascaderTrigger>

        <CascaderContent className='w-80'>
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
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
