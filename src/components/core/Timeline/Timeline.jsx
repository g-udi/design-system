import { cn } from '../../../utilities/cn';
import {
  Timeline as TimelineRoot,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from './parts/timeline-extended.jsx';

/**
 * A dated activity feed built from the Timeline parts, rendered as an ordered list. The marker sits
 * centred in a 1.5rem gutter and the rail runs between markers.
 */
export default function Timeline({
  items = [],
  label = 'Activity',
  className
}) {
  return (
    <TimelineRoot asChild value={ 0 } aria-label={ label } className={ cn('m-0 list-none p-0', className) }>
      <ol>
        {items.map((item, index) => (
          <TimelineItem asChild key={ item.id } step={ index + 1 } className='group-data-[orientation=vertical]/timeline:ms-9 group-data-[orientation=vertical]/timeline:not-last:pb-5'>
            <li>
              <TimelineHeader className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 pt-0.5'>
                <TimelineSeparator className='bg-border group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:h-[calc(100%-2rem)] group-data-[orientation=vertical]/timeline:translate-y-7' />
                <TimelineIndicator className='flex size-6 items-center justify-center border-0 bg-surface text-text-muted group-data-[orientation=vertical]/timeline:-left-6'>
                  {item.icon || <span className='size-2 rounded-full bg-accent' />}
                </TimelineIndicator>
                <TimelineTitle asChild className='text-text'>
                  <span>{item.title}</span>
                </TimelineTitle>
                {item.time && (
                  <TimelineDate dateTime={ item.dateTime } className='mb-0 font-normal text-text-muted'>
                    {item.time}
                  </TimelineDate>
                )}
              </TimelineHeader>
              {(item.description || item.children) && (
                <TimelineContent className='text-text-muted'>
                  {item.description && <p className='m-0'>{item.description}</p>}
                  {item.children}
                </TimelineContent>
              )}
            </li>
          </TimelineItem>
        ))}
      </ol>
    </TimelineRoot>
  );
}
