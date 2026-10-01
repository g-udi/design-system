'use client';
import { useId, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../core/Accordion/parts/collapsible.jsx';
import { Progress } from '../../../core/Progress/parts/progress.jsx';
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '../../../core/Timeline/parts/timeline-extended.jsx';
import { MessageStatus, MessageStatusIcon } from '../../../core/Message/parts/message-status.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

// Indicators carry the step status icon, so they sit a little further out than the default dot.
const rail = {
  item: 'group-data-[orientation=vertical]/timeline:ms-9',
  separator: 'group-data-[orientation=vertical]/timeline:-left-6.5 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.25rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-5.5',
  indicator: 'bg-surface flex size-5 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-6.5'
};

/**
 * The agent's plan for the current request. Steps are `{ id, title, status, description?, owner?, todos? }`
 * with the shared statuses (pending, running, done, failed, cancelled); todos are `{ title, status }`.
 * The header counts finished steps; it collapses to that summary.
 */
function ChatPlan({ title = 'Plan', steps = [], defaultOpen = true, labels, className }) {
  const [open, setOpen] = useState(defaultOpen);
  const done = steps.filter((step) => step.status === 'done').length;
  const running = steps.find((step) => step.status === 'running');
  const titleId = useId();
  return (
    <Collapsible open={open} onOpenChange={setOpen} data-slot='chat-plan' className={cn('ds-part-chat-plan bg-surface grid rounded-(--ds-radius-card) border text-sm', className)}>
      <CollapsibleTrigger className='hover:bg-surface-muted focus-visible:ring-accent grid w-full gap-2 rounded-(--ds-radius-card) px-3 py-2.5 text-start focus-visible:ring-2 focus-visible:outline-none'>
        <span className='flex items-center gap-2'>
          <RegistryIcon lucide='ListChecks' className='text-text-muted size-4 shrink-0' />
          <span id={titleId} className='min-w-0 flex-1 truncate font-medium'>{title}</span>
          <span className='text-text-muted shrink-0 text-xs tabular-nums'>{labels?.progress ? labels.progress(done, steps.length) : `${done} of ${steps.length} done`}</span>
          <RegistryIcon lucide='ChevronDown' className={cn('text-text-muted size-3.5 shrink-0 transition-transform motion-reduce:transition-none', open && 'rotate-180')} />
        </span>
        <Progress value={steps.length ? (done / steps.length) * 100 : 0} aria-labelledby={titleId} className='h-1' />
        {!open && running ? <span className='text-text-muted truncate text-xs'>{labels?.now || 'Now'}: {running.title}</span> : null}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='border-t px-3 py-3'>
          <Timeline value={done}>
            {steps.map((step, index) => (
              <TimelineItem key={step.id} step={index + 1} className={rail.item}>
                <TimelineHeader>
                  <TimelineSeparator className={rail.separator} />
                  <TimelineTitle className='flex items-center gap-2'>
                    <span className={cn('min-w-0 flex-1', step.status === 'cancelled' && 'text-text-muted line-through')}>{step.title}</span>
                    <MessageStatus status={step.status} labels={labels?.status} className='shrink-0' />
                  </TimelineTitle>
                  <TimelineIndicator className={rail.indicator}>
                    <MessageStatusIcon status={step.status} className='size-4' />
                  </TimelineIndicator>
                </TimelineHeader>
                {step.description || step.owner || step.todos?.length ? (
                  <TimelineContent className='grid gap-1.5'>
                    {step.description ? <p className='text-text-muted text-xs'>{step.description}</p> : null}
                    {step.owner ? <p className='text-text-muted text-xs'>{labels?.owner || 'Owner'}: <span className='text-text'>{step.owner}</span></p> : null}
                    {step.todos?.length ? (
                      <ul className='grid gap-1'>
                        {step.todos.map((todo) => (
                          <li key={todo.title} className='flex items-center gap-2 text-xs'>
                            <MessageStatusIcon status={todo.status} className='size-3' />
                            <span className={cn(todo.status === 'done' && 'text-text-muted line-through')}>{todo.title}</span>
                            <span className='sr-only'>({todo.status})</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </TimelineContent>
                ) : null}
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

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
                {item.icon ? <RegistryIcon lucide={item.icon} className='text-text-muted size-3' /> : <MessageStatusIcon status={item.status || 'done'} className='size-3.5' />}
              </TimelineIndicator>
            </TimelineHeader>
            {item.detail ? <TimelineContent className='text-text-muted text-xs'>{item.detail}</TimelineContent> : null}
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}

export { ChatActivity, ChatPlan };
