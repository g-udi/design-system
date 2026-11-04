'use client';
import { useId, useRef, useState } from 'react';
import Button from '../../core/Button/index.js';
import { Badge } from '../../core/Pill/index.js';
import { ProgressRoot } from '../../core/Progress/index.js';
import { Popover, PopoverTrigger, PopoverContent } from '../../core/Popover/index.js';
import { ChatAgentMark } from '../ChatAgentMark/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

import { cn } from '../../../utilities/cn/index.js';

function Job({ job, onAction, onInspect, fallbackRef }) {
  const [open, setOpen] = useState(false);
  const acted = useRef(false);
  const titleId = useId();
  function act(action) {
    acted.current = true; setOpen(false); onAction(job.id, action);
    requestAnimationFrame(() => fallbackRef.current?.focus());
  }
  return <Popover open={open} onOpenChange={value => { setOpen(value); if (value) { acted.current = false; onInspect?.(job.id); } }}>
    <PopoverTrigger asChild>
      <Button variant='ghost' aria-label={`Inspect ${job.name}`} className='h-auto w-full min-w-0 items-start justify-start gap-2 whitespace-normal px-2 py-2.5 text-start'>
        <RegistryIcon lucide={job.icon || 'File'} className='mt-0.5 size-4 shrink-0 text-text-muted' />
        <span className='grid min-w-0 gap-1'><span className='break-words text-sm font-medium'>{job.name}</span><span className='flex flex-wrap gap-x-2 gap-y-1 text-xs font-normal text-text-muted'><span>{job.kind}</span><bdi>{job.meta}</bdi>{job.priority && <span>Priority</span>}</span></span>
      </Button>
    </PopoverTrigger>
    <PopoverContent aria-labelledby={titleId} collisionPadding={12} align='start' className='ds-touch-controls grid w-80 min-w-0 gap-3' onCloseAutoFocus={event => { if (acted.current) { event.preventDefault(); fallbackRef.current?.focus(); } }}>
      <div className='flex items-start justify-between gap-2'><h4 id={titleId} className='min-w-0 break-words text-sm font-semibold'>{job.name}</h4><Button size='icon-sm' variant='ghost' aria-label='Close job details' onClick={() => setOpen(false)}><RegistryIcon lucide='X' className='size-4' /></Button></div>
      <p className='text-xs text-text-muted'><bdi>{job.detail}</bdi></p>
      {job.error && <p className='text-sm leading-relaxed'>{job.error}</p>}
      {job.progress != null && <p className='text-sm'>Progress: {job.progress}%</p>}
      {job.description && <p className='text-sm'>{job.description}</p>}
      {onAction && !!job.actions?.length && <div className='flex flex-wrap gap-2'>{job.actions.map(action => <Button key={action.id} size='sm' variant='outline' disabled={action.disabled} onClick={() => act(action.id)}>{action.label}</Button>)}</div>}
    </PopoverContent>
  </Popover>;
}

/** Queue presentation and accessible inspection. The host supplies ordering, workers, actions and scheduling. */
export function ChatAgentQueue({ title = 'Agent queue', description, waiting = [], workers = [], recent = [], summary, toolbar, notice, workersDescription, resultsDescription, onJobAction, onInspectJob, actionFocusRef, children, footer, className }) {
  const titleId = useId();
  const panelRef = useRef(null);
  function jobView(job) { return <Job job={job} onAction={onJobAction} onInspect={onInspectJob} fallbackRef={actionFocusRef || panelRef} />; }
  return <section aria-labelledby={titleId} ref={panelRef} tabIndex={-1} data-slot='chat-agent-queue' className={cn('ds-touch-controls @container grid w-full min-w-0 grid-cols-1 gap-5', className)}>
    <header className='flex flex-wrap items-center justify-between gap-3'><div className='grid gap-1'><h2 id={titleId} className='text-lg font-semibold'>{title}</h2>{description && <p className='text-sm text-text-muted'>{description}</p>}</div>{toolbar}</header>
    {summary && <dl className='m-0 grid grid-cols-2 gap-4 border-y border-border py-3 @[28rem]:grid-cols-4'>{summary.map(item => <div key={item.id} className='grid gap-1'><dt className='text-xs text-text-muted'>{item.label}</dt><dd className='m-0 text-base font-medium tabular-nums'><bdi>{item.value}</bdi></dd></div>)}</dl>}
    {notice}
    <div data-queue-layout className='grid min-w-0 grid-cols-1 gap-6 @[56rem]:grid-cols-3'>
      <section aria-label='Waiting jobs' className='min-w-0'><h3 className='mb-2 text-sm font-semibold'>Waiting <span className='font-normal text-text-muted'>({waiting.length})</span></h3>
        {waiting.length ? <ol className='m-0 max-h-80 list-none overflow-y-auto overscroll-contain p-0'>{waiting.map((job) => <li key={job.id} className='border-b border-border last:border-0'>{jobView(job)}</li>)}</ol> : <p className='py-4 text-sm text-text-muted'>No waiting jobs.</p>}
      </section>
      <section aria-label='Agent workers' className='min-w-0'><h3 className='mb-2 text-sm font-semibold'>Workers</h3><ul className='m-0 grid list-none gap-4 p-0'>
        {workers.map(worker => { const job = worker.job; return <li key={worker.id} className='grid min-w-0 gap-2 border-b border-border pb-4 last:border-0'><div className='flex flex-wrap items-center gap-2'><ChatAgentMark name={worker.name} icon={worker.icon || 'Bot'} size='xs' tone='neutral' decorative /><span className='min-w-0 flex-1 text-xs font-medium'><bdi>{worker.name}</bdi></span><Badge variant={worker.tone || 'secondary'}>{worker.statusLabel}</Badge></div>{job ? <>{jobView(job)}{job.progress != null && <div className='flex items-center gap-2 px-2'><ProgressRoot value={job.progress} aria-label={`${job.name} progress`} className='h-1.5 min-w-0 flex-1' /><span className='text-xs tabular-nums text-text-muted'>{job.progress}%</span></div>}</> : <p className='px-2 py-2 text-sm text-text-muted'>{worker.description || 'Ready for the next job'}</p>}</li>; })}
      </ul>{workersDescription && <p className='mt-2 text-xs text-text-muted'>{workersDescription}</p>}</section>
      <section aria-label='Recent results' className='min-w-0'><h3 className='mb-2 text-sm font-semibold'>Recent results</h3>{recent.length ? <ul className='m-0 max-h-80 list-none overflow-y-auto overscroll-contain p-0'>{recent.map(job => <li key={job.id} className='border-b border-border last:border-0'>{jobView(job)}</li>)}</ul> : <p className='py-4 text-sm text-text-muted'>Completed, failed and cancelled jobs appear here.</p>}{resultsDescription && <p className='mt-2 text-xs text-text-muted'>{resultsDescription}</p>}</section>
    </div>
    {children}
    {footer && <footer className='grid gap-3 border-t border-border pt-4'>{footer}</footer>}
  </section>;
}
