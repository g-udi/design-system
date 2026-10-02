'use client';
import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const portrait = (path) => `https://randomuser.me/api/portraits/${path}.jpg`;
const presenters = [
  { name: 'Maya Lopez', role: 'Head of Design, Gaudi', portrait: 'women/65' },
  { name: 'Omar Haddad', role: 'Staff Engineer, Gaudi', portrait: 'men/41' }
];
const sections = [
  { title: 'Overview', body: 'How we rebuilt article code blocks on one component: highlighting on demand, tabbed groups and copy that never picks up line numbers.', open: true },
  { title: 'Agenda', body: '15 min talk · 20 min live build · 10 min questions. A recording follows within a day.', open: false },
  { title: 'Before you join', body: 'Bring a Markdown file with a few fenced blocks; we will convert it during the session.', open: false }
];
const replies = { yes: 'You’re going. A calendar invite is on its way.', maybe: 'We’ll remind you the morning of the session.', skip: 'Got it. You’ll still get the recording.' };

export function Pattern() {
  const [rsvp, setRsvp] = useState('');
  return (
    <article className='bg-surface w-full max-w-md overflow-hidden rounded-lg border'>
      <img src='static/images/art/5.svg' alt='' className='h-28 w-full object-cover' />
      <div className='grid gap-4 p-5'>
        <div className='grid gap-1.5'>
          <Badge variant='info-light' size='sm' className='w-fit'>
            <RegistryIcon lucide='VideoIcon' aria-hidden='true' className='size-3' />
            Live webinar
          </Badge>
          <h3 className='text-lg font-semibold'>One component for every code block</h3>
          <p className='text-text-muted flex items-center gap-1.5 text-sm'>
            <RegistryIcon lucide='CalendarClockIcon' aria-hidden='true' className='size-4' />
            Thu, 22 Oct · 17:00–17:45 CEST
          </p>
        </div>
        <div className='divide-y rounded-md border'>
          {sections.map((section) => (
            <Collapsible key={section.title} defaultOpen={section.open}>
              <CollapsibleTrigger className='group flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium'>
                {section.title}
                <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' className='text-text-muted size-4 transition-transform group-data-[state=open]:rotate-180' />
              </CollapsibleTrigger>
              <CollapsibleContent className='text-text-muted px-3 pb-3 text-sm'>{section.body}</CollapsibleContent>
            </Collapsible>
          ))}
        </div>
        <div className='grid gap-2'>
          <p className='text-sm font-medium'>Presenters</p>
          {presenters.map((presenter) => (
            <div key={presenter.name} className='flex items-center gap-2.5'>
              <Avatar className='size-8'>
                <AvatarImage src={portrait(presenter.portrait)} alt={presenter.name} />
                <AvatarFallback>{presenter.name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className='text-sm'>
                <p className='font-medium'>{presenter.name}</p>
                <p className='text-text-muted text-xs'>{presenter.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className='grid gap-2 border-t pt-4'>
          <div className='flex items-center justify-between gap-2'>
            <span className='text-sm font-medium'>Going?</span>
            <div className='flex items-center gap-2'>
              <AvatarGroup>
                {['women/44', 'men/32', 'women/12'].map((person) => (
                  <Avatar key={person} className='size-6'>
                    <AvatarImage src={portrait(person)} alt='' />
                    <AvatarFallback>·</AvatarFallback>
                  </Avatar>
                ))}
                <AvatarGroupCount className='size-6 text-xs'>+{rsvp === 'yes' ? 129 : 128}</AvatarGroupCount>
              </AvatarGroup>
            </div>
          </div>
          <ToggleGroup aria-label='RSVP' type='single' variant='outline' size='sm' spacing={0} value={rsvp} onValueChange={setRsvp} className='w-full'>
            <ToggleGroupItem value='yes' className='flex-1'>Yes</ToggleGroupItem>
            <ToggleGroupItem value='maybe' className='flex-1'>Maybe</ToggleGroupItem>
            <ToggleGroupItem value='skip' className='flex-1'>Skip</ToggleGroupItem>
          </ToggleGroup>
          <p className='text-text-muted min-h-5 text-xs' aria-live='polite'>
            {replies[rsvp] || '131 people have replied.'}
          </p>
        </div>
      </div>
    </article>
  );
}
