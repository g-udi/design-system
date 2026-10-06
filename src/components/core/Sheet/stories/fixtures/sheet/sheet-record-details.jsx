'use client';
import { useState } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import { Badge } from '@gaudi/design-system/core/Pill';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import {
  TimelineRoot as Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '@gaudi/design-system/core/Timeline';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@gaudi/design-system/core/Sheet';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const owners = [['Maya Patel', 'person-23'], ['Leo Martins', 'person-41'], ['Ana Costa', 'person-20']];
const changes = [
  ['Target raised to 2,000', 'Maya Patel · Sep 28'],
  ['Alert threshold set to 15% drop', 'Leo Martins · Sep 21'],
  ['Metric created', 'Ana Costa · Sep 2']
];

function EditableRow({ label, value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  return (
    <div className='grid grid-cols-1 @sm:grid-cols-[7rem_minmax(0,1fr)] items-center gap-2 py-1.5 text-sm'>
      <dt className='text-text-muted'>{label}</dt>
      <dd className='flex min-w-0 items-center gap-2'>
        {editing ? (
          <>
            <Input aria-label={label} value={draft} onChange={(event) => setDraft(event.target.value)} className='h-8 min-w-0 flex-1' />
            <span className='flex gap-1'>
              <Button size='icon-xs' aria-label={`Save ${label}`} onClick={() => { onSave(draft); setEditing(false); }}>
                <RegistryIcon lucide='CheckIcon' aria-hidden='true' />
              </Button>
              <Button size='icon-xs' variant='ghost' aria-label={`Cancel editing ${label}`} onClick={() => { setDraft(value); setEditing(false); }}>
                <RegistryIcon lucide='XIcon' aria-hidden='true' />
              </Button>
            </span>
          </>
        ) : (
          <>
            <span className='min-w-0 flex-1 break-words font-medium'>{value}</span>
            <Button size='icon-xs' variant='ghost' aria-label={`Edit ${label}`} onClick={() => setEditing(true)}>
              <RegistryIcon lucide='PencilIcon' aria-hidden='true' />
            </Button>
          </>
        )}
      </dd>
    </div>
  );
}

// A record in a wide sheet: rows edit in place, with progress, owners, the alert rule and its history.
export function Pattern() {
  const [details, setDetails] = useState({ Name: 'Weekly new subscribers', Team: 'Growth', Target: '2,000 / week' });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='sm' variant='outline'>Open metric</Button>
      </SheetTrigger>
      <SheetContent size='lg' className='gap-0'>
        <SheetHeader className='border-b'>
          <div className='flex items-center gap-2'>
            <Badge size='sm' variant='outline'>MET-142</Badge>
            <Badge size='sm' variant='success-light'>On track</Badge>
          </div>
          <SheetTitle>{details.Name}</SheetTitle>
          <SheetDescription>Subscribers who confirmed their email in the last 7 days.</SheetDescription>
        </SheetHeader>
        <div className='grid min-h-0 flex-1 content-start gap-6 overflow-y-auto p-3'>
          <section className='grid gap-2'>
            <h3 className='text-sm font-medium'>Target progress</h3>
            <div className='flex items-baseline justify-between text-sm'>
              <span className='text-2xl font-semibold tabular-nums'>1,640</span>
              <span className='text-text-muted'>82% of 2,000</span>
            </div>
            <Progress value={82} aria-label='Progress to target' className='h-2' />
          </section>
          <section>
            <h3 className='mb-1 text-sm font-medium'>Details</h3>
            <dl className='@container divide-y'>
              {Object.entries(details).map(([label, value]) => (
                <EditableRow key={label} label={label} value={value} onSave={(next) => setDetails((current) => ({ ...current, [label]: next }))} />
              ))}
            </dl>
          </section>
          <section className='grid gap-2'>
            <h3 className='text-sm font-medium'>Owners</h3>
            <div className='flex items-center gap-3'>
              <AvatarGroup>
                {owners.map(([name, portrait]) => (
                  <Avatar key={name} className='size-7'>
                    <AvatarImage src={`/avatars/${portrait}.svg`} alt={name} />
                    <AvatarFallback>{name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <span className='text-text-muted text-sm'>{owners.map(([name]) => name.split(' ')[0]).join(', ')}</span>
            </div>
          </section>
          <section className='grid gap-2'>
            <h3 className='text-sm font-medium'>Alert rule</h3>
            <p className='bg-surface-muted flex items-center gap-2 rounded-md p-2 text-sm'>
              <RegistryIcon lucide='BellIcon' aria-hidden='true' className='text-warning size-4' />
              Notify owners when the week drops more than <Badge size='sm' variant='warning-light'>15%</Badge>
            </p>
          </section>
          <section className='grid gap-2'>
            <h3 className='text-sm font-medium'>Changes</h3>
            <Timeline defaultValue={changes.length}>
              {changes.map(([title, meta], index) => (
                <TimelineItem key={title} step={index + 1}>
                  <TimelineHeader>
                    <TimelineSeparator />
                    <TimelineTitle className='text-sm'>{title}</TimelineTitle>
                    <TimelineIndicator />
                  </TimelineHeader>
                  <TimelineContent>
                    <TimelineDate className='mb-0'>{meta}</TimelineDate>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </section>
        </div>
        <SheetFooter className='flex-row justify-end border-t'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
