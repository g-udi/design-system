'use client';
import { useId, useState } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../core/Accordion/Collapsible.jsx';
import { Progress } from '../../core/Progress/ProgressPrimitives.jsx';
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '../../core/Timeline/TimelinePrimitives.jsx';
import { ChatMessageStatus, ChatMessageStatusIcon } from '../shared/message-status.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { rail } from '../shared/timeline-rail.js';

/**
 * The agent's plan for the current request. Steps are `{ id, title, status, description?, owner?, todos?, notes? }`
 * with the shared statuses (pending, running, done, failed, cancelled); todos are `{ title, status }`.
 * The header counts finished steps; it collapses to that summary.
 */
function ChatPlan({ title = 'Plan', steps = [], defaultOpen = true, labels, className }) {
  const [open, setOpen] = useState(defaultOpen);
  const done = steps.filter((step) => step.status === 'done').length;
  const current = steps.find((step) => step.status === 'running') || steps.find((step) => step.status === 'awaiting');
  const titleId = useId();
  return (
    <Collapsible open={open} onOpenChange={setOpen} data-slot='chat-plan' className={cn('ds-part-chat-plan bg-surface grid rounded-(--ds-radius-card) border text-sm', className)}>
      <CollapsibleTrigger className='hover:bg-surface-muted focus-visible:ring-accent grid w-full gap-2 rounded-(--ds-radius-card) px-3 py-2.5 text-start focus-visible:ring-2 focus-visible:outline-none'>
        <span className='flex items-center gap-2'>
          <RegistryIcon lucide='ListChecks' className='text-text-muted size-4 shrink-0' />
          <span id={titleId} className='min-w-0 flex-1 truncate font-medium'>{title}</span>
          <bdi className='text-text-muted shrink-0 text-xs tabular-nums'>{labels?.progress ? labels.progress(done, steps.length) : `${done} of ${steps.length} done`}</bdi>
          <RegistryIcon lucide='ChevronDown' className={cn('text-text-muted size-3.5 shrink-0 transition-transform motion-reduce:transition-none', open && 'rotate-180')} />
        </span>
        <Progress value={steps.length ? (done / steps.length) * 100 : 0} aria-labelledby={titleId} className='h-1' />
        {!open && current ? <span className='text-text-muted truncate text-xs'>{labels?.now || 'Now'}: {current.title}</span> : null}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='border-t px-3 py-3'>
          <Timeline value={done} role='list' aria-labelledby={titleId}>
            {steps.map((step, index) => (
              <TimelineItem key={step.id} step={index + 1} role='listitem' aria-current={step === current ? 'step' : undefined} className={rail.item}>
                <TimelineHeader>
                  <TimelineSeparator className={rail.separator} />
                  <TimelineTitle className='flex items-center gap-2'>
                    <span className={cn('min-w-0 flex-1', step.status === 'cancelled' && 'text-text-muted line-through')}>{step.title}</span>
                    <ChatMessageStatus status={step.status} labels={labels?.status} className='shrink-0' />
                  </TimelineTitle>
                  <TimelineIndicator className={rail.indicator}>
                    <ChatMessageStatusIcon status={step.status} className='size-4' />
                  </TimelineIndicator>
                </TimelineHeader>
                {step.description || step.owner || step.todos?.length || step.notes?.length ? (
                  <TimelineContent className='grid gap-1.5'>
                    {step.description ? <p className='text-text-muted text-xs'>{step.description}</p> : null}
                    {step.owner ? <p className='text-text-muted text-xs'>{labels?.owner || 'Owner'}: <span className='text-text'>{step.owner}</span></p> : null}
                    {step.todos?.length ? (
                      <ul className='grid gap-1'>
                        {step.todos.map((todo) => (
                          <li key={todo.title} className='flex items-center gap-2 text-xs'>
                            <ChatMessageStatusIcon status={todo.status} className='size-3' />
                            <span className={cn(todo.status === 'done' && 'text-text-muted line-through')}>{todo.title}</span>
                            <span className='sr-only'>({todo.status})</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {step.notes?.length ? (
                      <ul aria-label={labels?.notes || 'Step notes'} className='m-0 grid min-w-0 list-none gap-2 p-0'>
                        {step.notes.map((note) => (
                          <li key={note.id} className='bg-surface-muted grid min-w-0 gap-1 rounded-(--ds-radius-control) p-2'>
                            {note.label ? <span className='text-text-muted text-xs'>{note.label}</span> : null}
                            <p className='text-text whitespace-pre-wrap wrap-anywhere text-sm'>{note.text}</p>
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

export { ChatPlan };
