'use client';
import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../../../src/components/core/Sheet/parts/sheet.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

const initial = [
  { id: 1, name: 'Maya Patel', portrait: 'women/65', text: 'mentioned you in', target: 'Launch checklist', when: '2m', unread: true, quote: 'Can you confirm the welcome email copy before Friday?' },
  { id: 2, name: 'Leo Martins', portrait: 'men/32', text: 'invited you to', target: 'Q4 roadmap review', when: '18m', unread: true, invite: true },
  { id: 3, name: 'Ana Costa', portrait: 'women/44', text: 'shared a file in', target: 'Brand assets', when: '1h', unread: true, file: 'cover-v3.png · 2.1 MB' },
  { id: 4, name: 'Sam Lee', portrait: 'men/75', text: 'closed', target: 'Fix onboarding email typo', when: 'Yesterday', unread: false }
];

// The bell shows the unread count; Mark all read clears it and the dots together.
export function Pattern() {
  const [items, setItems] = useState(initial);
  const unread = items.filter((item) => item.unread).length;
  const respond = (id, answer) => setItems((current) => current.map((item) => (item.id === id ? { ...item, unread: false, invite: false, answer } : item)));
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='sm' variant='outline' aria-label={`Notifications, ${unread} unread`}>
          <RegistryIcon lucide='BellIcon' aria-hidden='true' />
          Notifications
          {unread ? <Badge size='sm' className='ms-0.5 tabular-nums'>{unread}</Badge> : null}
        </Button>
      </SheetTrigger>
      <SheetContent inset aria-describedby='notifications-description'>
        <SheetHeader className='flex-row items-start justify-between gap-3 border-b pe-12'>
          <div className='grid gap-0.5'>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription id='notifications-description'>{unread ? `${unread} unread` : 'You are all caught up'}</SheetDescription>
          </div>
          <Button size='xs' variant='ghost' disabled={!unread} onClick={() => setItems((current) => current.map((item) => ({ ...item, unread: false })))}>
            <RegistryIcon lucide='CheckCheckIcon' aria-hidden='true' />
            Mark all read
          </Button>
        </SheetHeader>
        <ul className='min-h-0 flex-1 divide-y overflow-y-auto'>
          {items.map((item) => (
            <li key={item.id} className={cn('flex gap-3 p-3', item.unread && 'bg-accent-subtle/40')}>
              <Avatar className='size-8'>
                <AvatarImage src={`https://randomuser.me/api/portraits/${item.portrait}.jpg`} alt={item.name} />
                <AvatarFallback className='text-xs'>{item.name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className='grid min-w-0 flex-1 gap-1.5 text-sm'>
                <p>
                  <span className='font-medium'>{item.name}</span> <span className='text-text-muted'>{item.text}</span> <span className='font-medium'>{item.target}</span>
                </p>
                {item.quote ? <p className='text-text-muted border-s-2 ps-2'>{item.quote}</p> : null}
                {item.file ? (
                  <p className='bg-surface-muted inline-flex w-fit items-center gap-2 rounded-md px-2 py-1 text-xs'>
                    <RegistryIcon lucide='FileTextIcon' aria-hidden='true' className='size-3.5' />
                    {item.file}
                  </p>
                ) : null}
                {item.invite ? (
                  <div className='flex gap-2'>
                    <Button size='xs' onClick={() => respond(item.id, 'Accepted')}>Accept</Button>
                    <Button size='xs' variant='outline' onClick={() => respond(item.id, 'Declined')}>Decline</Button>
                  </div>
                ) : null}
                {item.answer ? <p className='text-text-muted text-xs'>{item.answer}</p> : null}
                <p className='text-text-muted text-xs'>{item.when}</p>
              </div>
              {item.unread ? <span aria-label='Unread' className='bg-accent mt-1.5 size-2 shrink-0 rounded-full' /> : null}
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
