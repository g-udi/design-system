// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator
} from '../../../../src/components/core/Timeline/parts/timeline-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
const roadmapItems = [
  {
    date: 'Dec 15, 2025',
    content: (
      <>
        <span className='text-ui-muted-foreground'>Completed</span> Beta Program
      </>
    ),
    color: 'bg-emerald-500'
  },
  {
    date: 'Nov 01, 2025',
    content: (
      <>
        <span className='text-ui-muted-foreground'>Completed</span> Usability
        Testing
      </>
    ),
    color: 'bg-violet-500'
  },
  {
    date: 'Oct 15, 2025',
    content: (
      <>
        <span className='text-ui-muted-foreground'>Initiated</span> Design Phase
      </>
    ),
    color: 'bg-fuchsia-500'
  },
  {
    date: 'Aug 01, 2024',
    content: (
      <>
        <span className='text-ui-muted-foreground'>Completed</span> Requirements
        Gathering
      </>
    ),
    color: 'bg-blue-500'
  },
  {
    date: 'Jul 15, 2024',
    content: (
      <>
        <span className='text-ui-muted-foreground'>Started</span> Project
        Kickoff
      </>
    ),
    color: 'bg-red-500'
  }
];
export function Pattern() {
  return (
    <div className='w-full max-w-xs'>
      <Timeline defaultValue={0} className='gap-2.5'>
        {roadmapItems.map((item, index) => (
          <TimelineItem
            key={index}
            step={index + 1}
            className='has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-ui-foreground/20 group-data-[orientation=vertical]/timeline:not-last:pb-0'
          >
            <TimelineHeader className='flex items-center gap-2.5'>
              <TimelineSeparator className='' />
              <TimelineIndicator
                className={cn('size-2 border-none', item.color)}
              />
              <TimelineDate className='text-ui-muted-foreground mb-0 text-[10px] font-semibold uppercase'>
                {item.date}
              </TimelineDate>
            </TimelineHeader>
            <TimelineContent className='text-ui-foreground text-sm font-medium'>
              {item.content}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
