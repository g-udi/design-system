'use client';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import { useState } from 'react';
import {
  getAvatarInitials,
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { EditableField } from '@gaudi/design-system/blocks/Forms';
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
        <ScrollArea aria-label='Metric details' className='min-h-0 min-w-0 flex-1 **:data-[slot=scroll-area-viewport]:[&>div]:block!'>
          <div className='grid content-start gap-6 p-3'>
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
              <div className='divide-y'>
                {Object.entries(details).map(([label, value]) => (
                  <EditableField key={label} label={label} value={value} onSave={(next) => setDetails((current) => ({ ...current, [label]: next }))} />
                ))}
              </div>
            </section>
            <section className='grid gap-2'>
              <h3 className='text-sm font-medium'>Owners</h3>
              <div className='flex items-center gap-3'>
                <AvatarGroup>
                  {owners.map(([name, portrait]) => (
                    <Avatar key={name} className='size-7'>
                      <AvatarImage src={`/avatars/${portrait}.svg`} alt={name} />
                      <AvatarFallback>{getAvatarInitials(name)}</AvatarFallback>
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
        </ScrollArea>
        <SheetFooter className='flex-row justify-end border-t'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
