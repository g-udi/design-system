'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '../../../../src/components/core/Tabs/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const user = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  initials: 'AJ',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
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
  const activeStatus = statuses.find((s) => s.value === status) || statuses[0];
  return (
    <div className='flex items-center justify-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='sm'>
            <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-44' sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Create</DropdownMenuLabel>
            {createItems.map((item) => (
              <DropdownMenuItem key={item.label}>
                <RegistryIcon lucide={item.icon} aria-hidden='true' />
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <RegistryIcon lucide='UploadIcon' aria-hidden='true' />
            Import data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation='vertical' className='my-auto h-4' />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='w-44'>
            <UserAvatar className='size-5' />
            <span className='truncate text-sm font-medium'>{user.name}</span>
            <RegistryIcon lucide='ChevronsUpDownIcon' className='ml-auto opacity-60' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-60' align='end' sideOffset={8}>
          <DropdownMenuLabel className='flex items-center gap-2 py-1.5'>
            <UserAvatar className='size-8' />
            <span className='flex min-w-0 flex-col'>
              <span className='text-text truncate text-sm font-medium'>{user.name}</span>
              <span className='text-text-muted truncate text-xs font-normal'>{user.email}</span>
            </span>
          </DropdownMenuLabel>
          <div className='px-1 pb-2'>
            <Tabs value={theme} onValueChange={setTheme}>
              <TabsList className='w-full'>
                {themes.map((item) => (
                  <TabsTrigger key={item.value} value={item.value} aria-label={item.label} className='h-6 flex-1'>
                    <RegistryIcon lucide={item.icon} className='size-4' aria-hidden='true' />
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className={cn('size-2 rounded-full', activeStatus.color)} aria-hidden='true' />
              {activeStatus.label}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className='w-40'>
              {statuses.map((s) => (
                <DropdownMenuItem key={s.value} onSelect={() => setStatus(s.value)}>
                  <span className={cn('size-2 rounded-full', s.color)} aria-hidden='true' />
                  {s.label}
                  {status === s.value && (
                    <RegistryIcon lucide='CheckIcon' className='text-text-muted ml-auto size-4' aria-hidden='true' />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {counts.map((item) => (
              <DropdownMenuItem key={item.label}>
                <RegistryIcon lucide={item.icon} aria-hidden='true' />
                {item.label}
                <Badge variant='secondary' size='sm' className='ml-auto rounded-control px-1.5'>
                  {item.count}
                </Badge>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem>
              <RegistryIcon lucide='UserIcon' aria-hidden='true' />
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='LifeBuoyIcon' aria-hidden='true' />
              Help center
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>
            <RegistryIcon lucide='LogOutIcon' aria-hidden='true' />
            Sign out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
