'use client';
import { useState } from 'react';
import { usePrefersColorScheme } from '@gaudi/design-system/hooks/environment/use-prefers-color-scheme';
import Dialog from '@gaudi/design-system/core/Dialog';
import { Field, FieldInput, FieldLabel } from '@gaudi/design-system/core/Field';

import { Badge, StatusDot } from '@gaudi/design-system/core/Pill';
import { cn } from '@gaudi/design-system/utilities/cn';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { MetaSeparator, Separator } from '@gaudi/design-system/core/Separator';

import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const user = {
  name: 'Anouk Varga',
  email: 'anouk@example.com',
  initials: 'AV',
  avatar: '/avatars/person-41.svg'
};
const createItems = [
  { label: 'New customer', icon: 'UserPlusIcon' },
  { label: 'New order', icon: 'ShoppingCartIcon' },
  { label: 'New invoice', icon: 'FileTextIcon' }
];
const statuses = [
  { value: 'available', label: 'Available', color: 'bg-success' },
  { value: 'away', label: 'Away', color: 'bg-warning' },
  { value: 'busy', label: 'Busy', color: 'bg-danger' },
  { value: 'offline', label: 'Offline', color: 'bg-text-muted' }
];
const themes = [
  { value: 'light', label: 'Light theme', icon: 'SunIcon' },
  { value: 'dark', label: 'Dark theme', icon: 'MoonIcon' },
  { value: 'system', label: 'System theme', icon: 'MonitorIcon' }
];
const counts = [
  { label: 'Your companies', icon: 'BuildingIcon', count: 12 },
  { label: 'Your numbers', icon: 'PhoneIcon', count: 2 }
];
function UserAvatar({ className }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  );
}
// An app header: a create menu next to the account menu with theme, presence status, counts and sign out.
export function Pattern() {
  const [status, setStatus] = useState('available');
  const [theme, setTheme] = useState('light');
  const [create, setCreate] = useState(null);
  const [records, setRecords] = useState([]);
  const [signedIn, setSignedIn] = useState(true);
  const system = usePrefersColorScheme();
  const surface = theme === 'system' ? system : theme;
  if (!signedIn) return <Button variant='outline' onClick={() => setSignedIn(true)}>Return to demo account</Button>;
  const activeStatus = statuses.find((s) => s.value === status) || statuses[0];
  return (
    <div className={cn(surface, 'flex flex-wrap items-center justify-center gap-2')}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='sm'>
            <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className={cn(surface, 'w-44')} sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Create</DropdownMenuLabel>
            {createItems.map((item) => (
              <DropdownMenuItem key={item.label} onSelect={() => setCreate(item.label)}>
                <RegistryIcon lucide={item.icon} aria-hidden='true' />
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation='vertical' className='my-auto h-4' />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className={cn(surface, 'w-44')}>
            <UserAvatar className='size-5' />
            <span className='truncate text-sm font-medium'>{user.name}</span>
            <RegistryIcon lucide='ChevronsUpDownIcon' className='ml-auto opacity-60' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn(surface, 'w-60')} align='end' sideOffset={8}>
          <DropdownMenuLabel className='flex items-center gap-2 py-1.5'>
            <UserAvatar className='size-8' />
            <span className='flex min-w-0 flex-col'>
              <span className='text-text truncate text-sm font-medium'>{user.name}</span>
              <span className='text-text-muted truncate text-xs font-normal'>{user.email}</span>
            </span>
          </DropdownMenuLabel>
          <div className='px-1 pb-2'>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Appearance</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className={surface}>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  {themes.map(item => <DropdownMenuRadioItem key={item.value} value={item.value}><RegistryIcon lucide={item.icon} aria-hidden='true' />{item.label}</DropdownMenuRadioItem>)}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </div>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <StatusDot className={cn('size-2', activeStatus.color)} />
              {activeStatus.label}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className={cn(surface, 'w-40')}>
              <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
                {statuses.map(item => <DropdownMenuRadioItem key={item.value} value={item.value}><StatusDot className={item.color} />{item.label}</DropdownMenuRadioItem>)}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          {counts.map(item => <DropdownMenuLabel key={item.label} className='flex items-center gap-2 font-normal'><RegistryIcon lucide={item.icon} aria-hidden='true' />{item.label}<Badge variant='secondary' className='ms-auto'>{item.count}</Badge></DropdownMenuLabel>)}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onSelect={() => setSignedIn(false)}><RegistryIcon lucide='LogOutIcon' aria-hidden='true' />Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {records.length > 0 && <ul aria-label='Created records' className='w-full text-center text-sm'>{records.map(record => <li key={record.id}>{record.type} <MetaSeparator /> {record.name}</li>)}</ul>}
      {create && <Dialog open onOpenChange={open => { if (!open) setCreate(null); }} title={create} description='Create a record for this workspace.'>
        <form className='grid gap-3' onSubmit={event => { event.preventDefault(); const name = String(new FormData(event.currentTarget).get('name')).trim(); if (!name) return;
          setRecords(list => [...list, { id: crypto.randomUUID(), type: create.slice(4), name }]); setCreate(null); }}>
          <Field><FieldLabel htmlFor='menu-record-name'>Name</FieldLabel><FieldInput id='menu-record-name' name='name' required /></Field><Button type='submit' className='w-fit'>Create</Button>
        </form>
      </Dialog>}
    </div>
  );
}
