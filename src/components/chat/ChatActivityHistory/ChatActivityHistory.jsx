import { cn } from '../../../utilities/cn/index.js';
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '../../core/Timeline/TimelinePrimitives.jsx';
import { ChatMessageStatusIcon } from '../shared/message-status.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { rail } from '../shared/timeline-rail.js';

/**
 * What happened in the conversation, newest last: tool runs, handoffs, files and decisions.
 * Items are `{ id, title, time, detail?, status?, icon? }`.
 */
function ChatActivity({ items = [], title = 'Activity', className }) {
  return (
    <section data-slot='chat-activity' aria-label={title} className={cn('ds-part-chat-activity grid gap-3 text-sm', className)}>
      <h2 className='text-sm font-semibold'>{title}</h2>
      {/* A history, not a progression: every item reads as settled, on a neutral rail. */}
      <Timeline value={0}>
        {items.map((item, index) => (
          <TimelineItem key={item.id} step={index + 1} className={rail.item}>
            <TimelineHeader>
              <TimelineSeparator className={cn(rail.separator, 'bg-border')} />
              <TimelineDate className='text-text-muted text-xs'>{item.time}</TimelineDate>
              <TimelineTitle className='text-sm font-normal'>{item.title}</TimelineTitle>
              <TimelineIndicator className={cn(rail.indicator, 'bg-surface-muted')}>
                {item.icon ? <RegistryIcon lucide={item.icon} className='text-text-muted size-3' /> : <ChatMessageStatusIcon status={item.status || 'done'} className='size-3.5' />}
              </TimelineIndicator>
            </TimelineHeader>
            {item.detail ? <TimelineContent className='text-text-muted text-xs'>{item.detail}</TimelineContent> : null}
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}

export { ChatActivity };
