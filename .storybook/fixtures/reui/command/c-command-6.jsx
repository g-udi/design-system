// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../../../../src/components/core/Commander/parts/command.jsx';
const users = [
  {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Admin'
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Editor'
  },
  {
    name: 'David Kim',
    email: 'david@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    role: 'Viewer'
  },
  {
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    role: 'Admin'
  },
  {
    name: 'Michael Rodriguez',
    email: 'michael@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    role: 'Editor'
  }
];
export function Pattern() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant='outline'>
        Search Users
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder='Search by name or email...' />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup heading='Team Members'>
              {users.map((user) => (
                <CommandItem key={user.email} className='gap-2 py-2'>
                  <Avatar className='size-6 shrink-0'>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className='text-xs'>
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-1 flex-col'>
                    <span className='text-sm font-medium'>{user.name}</span>
                    <span className='text-ui-muted-foreground text-xs'>
                      {user.email}
                    </span>
                  </div>
                  <div className='ml-auto' data-slot='command-shortcut'>
                    <Badge
                      variant={
                        user.role === 'Admin'
                          ? 'primary-light'
                          : user.role === 'Editor'
                            ? 'info-light'
                            : 'success-light'
                      }
                      size='sm'
                    >
                      {user.role}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
