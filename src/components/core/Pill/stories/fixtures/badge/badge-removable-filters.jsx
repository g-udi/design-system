'use client';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const initial = [
  { id: 'alex', label: 'Alex', avatar: '/avatars/person-41.svg' },
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
