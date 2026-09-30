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
import { cn } from '../../../../src/utilities/cn/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const releases = [
  {
    id: 1,
    version: 'v1.0',
    date: 'Jan 2025',
    title: 'Initial Release',
    status: 'released'
  },
  {
    id: 2,
    version: 'v1.1',
    date: 'Mar 2025',
    title: 'Bug Fixes',
    status: 'released'
  },
  {
    id: 3,
    version: 'v2.0',
    date: 'Jun 2025',
    title: 'Major Update',
    status: 'current'
  },
  {
    id: 4,
    version: 'v2.1',
    date: 'Sep 2025',
    title: 'Improvements',
    status: 'upcoming'
  }
];
export function Pattern() {
  return (
    <Timeline
      defaultValue={3}
      orientation='horizontal'
      className='w-full max-w-xl overflow-x-auto'
    >
      {releases.map((release) => (
        <TimelineItem key={release.id} step={release.id}>
          <TimelineHeader>
            <TimelineSeparator className='bg-ui-input! group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:left-2.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-2.25rem)]' />
            <TimelineDate>{release.date}</TimelineDate>
            <TimelineTitle className='flex items-center gap-2'>
              {release.version}
              {release.status === 'current' && (
                <Badge variant='primary-light' size='sm'>
                  Current
                </Badge>
              )}
            </TimelineTitle>
            <TimelineIndicator
              className={cn(
                'flex size-6 items-center justify-center border-none',
                release.status === 'released' && 'bg-emerald-500 text-white',
                release.status === 'current' &&
                  'bg-ui-primary text-ui-primary-foreground',
                release.status === 'upcoming' &&
                  'bg-ui-muted text-ui-muted-foreground'
              )}
            >
              {release.status === 'released' ? (
                <RegistryIcon lucide='CheckIcon' className='size-3.5' />
              ) : release.status === 'current' ? (
                <RegistryIcon lucide='PlayIcon' className='size-3' />
              ) : (
                <RegistryIcon lucide='CircleIcon' className='size-3' />
              )}
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent className='text-xs'>{release.title}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
