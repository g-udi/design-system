'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const initial = [
  { id: 'alex', label: 'Alex', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'design', label: 'Design' },
  { id: 'open', label: 'Status: Open' }
];
export function Pattern() {
  const [filters, setFilters] = useState(initial);
  return (
    <div className='mx-auto flex w-full max-w-sm flex-wrap items-center justify-center gap-2'>
      {filters.map(({ id, label, avatar }) => (
        <Badge key={id} variant='outline' size='lg' className='gap-1'>
          {avatar ? (
            <Avatar className='size-3.5'>
              <AvatarImage src={avatar} alt='' />
              <AvatarFallback>{label.slice(0, 2)}</AvatarFallback>
            </Avatar>
          ) : null}
          {label}
          <Button
            aria-label={`Remove ${label}`}
            variant='ghost'
            size='icon'
            className='size-3.5 text-text-muted hover:bg-transparent hover:text-text'
            onClick={() => setFilters((items) => items.filter((item) => item.id !== id))}
          >
            <RegistryIcon lucide='XIcon' aria-hidden='true' />
          </Button>
        </Badge>
      ))}
      {filters.length < initial.length ? (
        <Button variant='link' size='xs' onClick={() => setFilters(initial)}>
          Reset
        </Button>
      ) : null}
      <Badge variant='primary-outline' size='lg' asChild>
        <a href='#'>View all tags</a>
      </Badge>
    </div>
  );
}
