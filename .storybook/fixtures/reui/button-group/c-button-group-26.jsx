// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const users = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'AJ'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'SC'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    initials: 'MR'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    initials: 'EW'
  }
];
export function Pattern() {
  const [selectedUserId, setSelectedUserId] = useState('3');
  return (
    <ButtonGroup>
      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
        <SelectTrigger aria-label='Select user' className='w-40'>
          <SelectValue placeholder='Select user' />
        </SelectTrigger>
        <SelectContent position='popper' className='min-w-[200px]'>
          <SelectGroup>
            <SelectLabel>Team Members</SelectLabel>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <span className='flex items-center gap-2'>
                  <Avatar className='size-5'>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className='text-xs'>
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className='truncate'>{user.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button variant='outline' size='icon' aria-label='Add Tag'>
        <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
      </Button>
      <Button variant='outline' size='icon' aria-label='Settings'>
        <RegistryIcon lucide='Settings2Icon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
