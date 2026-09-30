'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '../../../../src/components/core/Timeline/parts/timeline-extended.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const releases = [
  { id: 1, version: 'v1.0', date: 'Jan 2025', title: 'Initial release', status: 'released' },
  { id: 2, version: 'v1.1', date: 'Mar 2025', title: 'Bug fixes', status: 'released' },
  { id: 3, version: 'v2.0', date: 'Jun 2025', title: 'Major update', status: 'current' },
  { id: 4, version: 'v2.1', date: 'Sep 2025', title: 'Improvements', status: 'upcoming' }
];

const indicatorTone = {
  released: 'bg-success text-success-foreground',
  current: 'bg-ui-primary text-ui-primary-foreground',
  upcoming: 'bg-ui-muted text-ui-muted-foreground'
};

const indicatorIcon = { released: 'CheckIcon', current: 'PlayIcon', upcoming: 'CircleIcon' };

export function Pattern() {
  // Dates above the rail lead each column; otherwise they sit with the title below it.
  const [datesAbove, setDatesAbove] = useState(false);
  const rail = datesAbove ? 'group-data-[orientation=horizontal]/timeline:top-7' : 'group-data-[orientation=horizontal]/timeline:-top-6';
  return (
    <div className='mx-auto flex w-full max-w-xl flex-col gap-3'>
      <Label className='gap-2 text-sm font-normal'>
        <Switch size='sm' checked={datesAbove} onCheckedChange={setDatesAbove} />
        Dates above the rail
      </Label>
      <Timeline defaultValue={3} orientation='horizontal' className='overflow-x-auto'>
        {releases.map((release) => (
          <TimelineItem
            key={release.id}
            step={release.id}
            className={cn('min-w-28', datesAbove && 'group-data-[orientation=horizontal]/timeline:mt-0')}
          >
            <TimelineHeader>
              <TimelineSeparator
                className={cn(
                  'bg-ui-input! group-data-[orientation=horizontal]/timeline:left-2.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-2.25rem)]',
                  rail
                )}
              />
              <TimelineDate className={cn(datesAbove && 'mb-8')}>{release.date}</TimelineDate>
              <TimelineTitle className='flex items-center gap-2'>
                {release.version}
                {release.status === 'current' && (
                  <Badge variant='primary-light' size='sm'>
                    Current
                  </Badge>
                )}
              </TimelineTitle>
              <TimelineIndicator
                className={cn('flex size-6 items-center justify-center border-none', indicatorTone[release.status], rail)}
              >
                <RegistryIcon
                  lucide={indicatorIcon[release.status]}
                  className={release.status === 'released' ? 'size-3.5' : 'size-3'}
                />
              </TimelineIndicator>
            </TimelineHeader>
            <TimelineContent className='text-xs'>{release.title}</TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
