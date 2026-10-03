'use client';
import { useState } from 'react';
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator
} from '../../../../src/components/core/Timeline/parts/timeline-extended.jsx';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle
} from '../../../../src/components/core/Attachment/parts/attachment.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Rating } from '../../../../src/components/core/Rating/parts/rating-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const portrait = (path) => `/avatars/${path}.jpg`;
const initials = (name) => name.split(' ').map((part) => part[0]).join('');
const people = {
  sarah: { name: 'Sarah Chen', avatar: portrait('women/44') },
  david: { name: 'David Kim', avatar: portrait('men/49') },
  emma: { name: 'Emma Wilson', avatar: portrait('women/68') },
  sofia: { name: 'Sofia Martins', avatar: portrait('women/12') },
  alex: { name: 'Alex Johnson', avatar: portrait('men/32') },
  lee: { name: 'Lee Park', avatar: portrait('men/75') }
};
const initialEvents = [
  {
    id: 1,
    actor: people.sarah,
    action: 'uploaded 2 files to',
    target: 'Q4 planning',
    date: '5 minutes ago',
    files: [
      { name: 'roadmap-q4.pdf', size: '2.4 MB', icon: 'FileTextIcon' },
      { name: 'budget.csv', size: '18 KB', icon: 'FileSpreadsheetIcon' }
    ]
  },
  {
    id: 2,
    actor: people.david,
    action: 'scheduled',
    target: 'Design review',
    date: '20 minutes ago',
    participants: [people.emma, people.alex, people.lee],
    more: 2
  },
  { id: 3, actor: people.emma, action: 'deployed a1b2c3d to', target: 'production', date: '1 hour ago', status: 'success' },
  { id: 4, actor: people.sofia, action: 'deployed i7j8k9l to', target: 'preview', date: '2 hours ago', status: 'failed' },
  { id: 5, actor: people.alex, action: 'updated progress on', target: 'Onboarding revamp', date: '3 hours ago', progress: 68 },
  { id: 6, actor: people.lee, action: 'reviewed', target: 'v2.4.0', date: 'Yesterday', rating: 4, quote: 'Tabbed code reads exactly like the articles. Ship it.' }
];

function Person({ person, className }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={person.avatar} alt={person.name} />
      <AvatarFallback>{initials(person.name)}</AvatarFallback>
    </Avatar>
  );
}

function EventMenu({ event, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-xs' aria-label={`Actions for ${event.actor.name}: ${event.target}`} className='shrink-0'>
          <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem>Copy link</DropdownMenuItem>
        <DropdownMenuItem>Mute thread</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive' onSelect={() => onDelete(event.id)}>
          Delete event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Each event carries its own payload: files, participants, a deploy status, progress or a rating.
function EventDetail({ event }) {
  if (event.files)
    return (
      <AttachmentGroup className='mt-2 gap-2'>
        {event.files.map((file) => (
          <Attachment key={file.name}>
            <AttachmentMedia>
              <RegistryIcon lucide={file.icon} aria-hidden='true' />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{file.name}</AttachmentTitle>
              <AttachmentDescription>{file.size}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={`Download ${file.name}`}>
                <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </AttachmentGroup>
    );
  if (event.participants)
    return (
      <AvatarGroup className='mt-2'>
        {event.participants.map((person) => (
          <Person key={person.name} person={person} className='size-6' />
        ))}
        <AvatarGroupCount className='size-6 text-xs'>+{event.more}</AvatarGroupCount>
      </AvatarGroup>
    );
  if (event.progress !== undefined)
    return (
      <div className='mt-2 flex items-center gap-3'>
        <Progress value={event.progress} className='h-1.5' aria-label={`${event.target} progress`} />
        <span className='text-text-muted text-xs tabular-nums'>{event.progress}%</span>
      </div>
    );
  if (event.rating)
    return (
      <div className='mt-2 grid gap-1'>
        <Rating rating={event.rating} size='sm' />
        <p className='text-text-muted text-sm'>{event.quote}</p>
      </div>
    );
  return null;
}

export function Pattern() {
  const [events, setEvents] = useState(initialEvents);
  const remove = (id) => setEvents((current) => current.filter((event) => event.id !== id));
  return (
    <div className='w-full max-w-lg'>
      <Timeline defaultValue={initialEvents.length}>
        {events.map((event) => (
          <TimelineItem key={event.id} step={event.id} className='group-data-[orientation=vertical]/timeline:ms-10'>
            <TimelineHeader>
              <TimelineSeparator className='bg-ui-input! group-data-[orientation=vertical]/timeline:top-2 group-data-[orientation=vertical]/timeline:-left-8 group-data-[orientation=vertical]/timeline:h-[calc(100%-2.5rem)] group-data-[orientation=vertical]/timeline:translate-y-7' />
              <TimelineIndicator className='size-8 overflow-hidden rounded-full border-none group-data-[orientation=vertical]/timeline:-left-8'>
                <Person person={event.actor} className='size-8' />
              </TimelineIndicator>
            </TimelineHeader>
            <TimelineContent>
              <div className='flex items-start gap-2'>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm'>
                    <span className='font-medium'>{event.actor.name}</span>{' '}
                    <span className='text-ui-muted-foreground'>{event.action}</span>{' '}
                    <span className='font-medium'>{event.target}</span>
                    {event.status && (
                      <Badge className='ms-2 align-middle' variant={event.status === 'success' ? 'success-light' : 'destructive-light'} size='sm'>
                        {event.status}
                      </Badge>
                    )}
                  </p>
                  <TimelineDate className='mt-0.5 mb-0'>{event.date}</TimelineDate>
                </div>
                <EventMenu event={event} onDelete={remove} />
              </div>
              <EventDetail event={event} />
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
