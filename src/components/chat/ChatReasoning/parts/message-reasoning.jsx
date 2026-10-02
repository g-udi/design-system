'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../core/Accordion/parts/collapsible.jsx';
import { Shimmer } from '../../../core/Skeleton/parts/shimmer.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { useControllableState } from '../../../../hooks/state/use-controllable-state.js';
import { MessageStatusIcon, messageStatuses } from '../../shared/message-status.jsx';
import { SourceIcon, siteOf } from '../../shared/source.jsx';

/*
 * Reasoning, chain-of-thought steps, search results and image thumbnails adapted from AI SDK Elements
 * (MIT, Copyright (c) 2023 Vercel, Inc.) onto Gaudi's disclosure, status vocabulary and tokens.
 */

const AUTO_CLOSE_DELAY = 1000;

/**
 * Opens when the model starts thinking, then folds itself away `autoCloseDelay` ms after `streaming` ends
 * so the answer leads. A reader who toggles it keeps their choice until the next round of thinking; a
 * controlled `open` always wins.
 */
function useReasoningDisclosure({ streaming = false, defaultOpen = true, open, onOpenChange, autoCloseDelay = AUTO_CLOSE_DELAY }) {
  const [internal, setInternal] = useState(defaultOpen);
  const chosen = useRef(false);
  const wasStreaming = useRef(streaming);
  const isOpen = open ?? internal;
  const request = (next, byReader) => {
    if (byReader) chosen.current = true;
    setInternal(next);
    onOpenChange?.(next);
  };
  useEffect(() => {
    const started = !wasStreaming.current && streaming;
    const finished = wasStreaming.current && !streaming;
    wasStreaming.current = streaming;
    if (started) {
      chosen.current = false;
      if (!isOpen) request(true, false);
      return undefined;
    }
    if (!finished || chosen.current || !isOpen) return undefined;
    const timer = setTimeout(() => request(false, false), autoCloseDelay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming]);
  return { isOpen, setOpen: (next) => request(next, true) };
}

/** Seconds spent thinking: measured from `streaming` start to end unless the host passes `duration`. */
function useReasoningDuration(streaming, duration) {
  const [measured, setMeasured] = useState();
  const startedAt = useRef(null);
  useEffect(() => {
    if (streaming) {
      startedAt.current = Date.now();
      return;
    }
    if (startedAt.current == null) return;
    setMeasured((Date.now() - startedAt.current) / 1000);
    startedAt.current = null;
  }, [streaming]);
  return duration ?? measured;
}

const formatDuration = (seconds) => (seconds < 60 ? `${Math.max(1, Math.round(seconds))}s` : `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`);

/**
 * The "thinking" disclosure; children are MessageReasoningStep rows or free text. `variant='steps'` drops
 * the quote rule so detailed steps can draw their own rail (a chain of thought).
 */
function MessageReasoning({ streaming = false, duration, label, thinkingLabel = 'Thinking…', variant = 'trail', defaultOpen = true, open, onOpenChange, autoCloseDelay, className, children }) {
  const { isOpen, setOpen } = useReasoningDisclosure({ streaming, defaultOpen, open, onOpenChange, autoCloseDelay });
  const seconds = useReasoningDuration(streaming, duration);
  const title = label || (streaming ? thinkingLabel : seconds != null ? `Thought for ${formatDuration(seconds)}` : 'Reasoning');
  return (
    <Collapsible open={isOpen} onOpenChange={setOpen} data-slot='message-reasoning' data-variant={variant} data-streaming={streaming || undefined} className={cn('ds-part-message-reasoning grid gap-2', className)}>
      <CollapsibleTrigger className='text-text-muted hover:text-text focus-visible:ring-accent group/reasoning inline-flex w-fit max-w-full items-center gap-1.5 rounded-(--ds-radius-control) text-start text-xs font-medium focus-visible:ring-2 focus-visible:outline-none'>
        <RegistryIcon lucide='Brain' className='size-3.5 shrink-0' />
        <Shimmer active={streaming} className='min-w-0'>{title}</Shimmer>
        <RegistryIcon lucide='ChevronDown' className={cn('size-3.5 shrink-0 transition-transform motion-reduce:transition-none', isOpen && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className={cn('text-text-muted grid text-sm leading-relaxed', variant === 'steps' ? 'gap-0' : 'border-border gap-2 border-s-2 ps-3')}>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const defaultStepLabels = { pending: 'Pending', running: 'In progress', done: 'Done', failed: 'Failed', cancelled: 'Skipped' };

/**
 * One step of the reasoning trail: `status` pending, running, done, failed or cancelled.
 *
 * - Plain: children are the step's text, after its status icon.
 * - Detailed (`label`): a chain-of-thought step with an `icon` for its kind (search, read, analyse…),
 *   a `description`, `meta` on the right, and children as details that open from the label. Steps are
 *   joined by a rail; a step opens while it runs (its label shimmers) and closes when it finishes,
 *   unless the reader toggled it.
 */
function MessageReasoningStep({ status = 'done', label, description, icon, meta, labels, defaultOpen, open, onOpenChange, className, children }) {
  const [isOpen, setOpenState] = useControllableState({ value: open, defaultValue: defaultOpen ?? status === 'running', onChange: onOpenChange });
  const chosen = useRef(false);
  const previous = useRef(status);
  // A step opens while it runs and closes when it finishes, until the reader toggles it themselves.
  useEffect(() => {
    if (previous.current === status) return;
    const wasRunning = previous.current === 'running';
    previous.current = status;
    if (chosen.current) return;
    if (status === 'running') setOpenState(true);
    else if (wasRunning) setOpenState(false);
  }, [status, setOpenState]);
  const setOpen = (next) => {
    chosen.current = true;
    setOpenState(next);
  };
  if (label == null) {
    return (
      <div data-slot='message-reasoning-step' data-status={status} className={cn('flex items-start gap-2', className)}>
        <MessageStatusIcon status={status} className='mt-0.5' />
        <div className='min-w-0'>{children}</div>
      </div>
    );
  }
  const statusText = { ...defaultStepLabels, ...labels }[status] || messageStatuses[status]?.label;
  const hasDetails = children != null && children !== false;
  const heading = (
    <>
      <span className='grid min-w-0 flex-1 gap-0.5'>
        <span className={cn('font-medium', status === 'pending' || status === 'cancelled' ? 'text-text-subtle' : 'text-text')}>
          <Shimmer active={status === 'running'}>{label}</Shimmer>
        </span>
        {description ? <span className='text-text-muted text-xs'>{description}</span> : null}
      </span>
      {meta ? <span className='text-text-muted shrink-0 text-xs tabular-nums'>{meta}</span> : null}
      {icon ? <MessageStatusIcon status={status} className='mt-0.5' /> : null}
      <span className='sr-only'>{`, ${statusText}`}</span>
    </>
  );
  return (
    <div data-slot='message-reasoning-step' data-status={status} data-variant='detailed' className={cn('group/step relative grid grid-cols-[1rem_minmax(0,1fr)] gap-x-2.5 pb-3 last:pb-0', className)}>
      <span aria-hidden='true' data-slot='message-reasoning-rail' className='bg-border absolute start-[calc(0.5rem-0.5px)] top-6 bottom-1 w-px group-last/step:hidden' />
      <span className='mt-0.5 grid size-4 place-items-center'>
        {icon ? <RegistryIcon lucide={icon} className={cn('size-3.5', messageStatuses[status]?.tone || 'text-text-muted')} /> : <MessageStatusIcon status={status} />}
      </span>
      {hasDetails ? (
        <Collapsible
          open={isOpen}
          onOpenChange={setOpen}
          className='min-w-0'
        >
          <CollapsibleTrigger className='hover:text-text focus-visible:ring-accent flex w-full min-w-0 items-start gap-2 rounded-(--ds-radius-control) text-start text-sm focus-visible:ring-2 focus-visible:outline-none'>
            {heading}
            <RegistryIcon lucide='ChevronDown' className={cn('text-text-muted mt-0.5 size-3.5 shrink-0 transition-transform motion-reduce:transition-none', isOpen && 'rotate-180')} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='grid gap-2 pt-2'>{children}</div>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className='flex min-w-0 items-start gap-2 text-sm'>{heading}</div>
      )}
    </div>
  );
}

/** Search results a step found, as link chips with the site's favicon. */
function MessageReasoningResults({ results = [], label = 'Search results', max, className }) {
  if (!results.length) return null;
  const shown = max ? results.slice(0, max) : results;
  const more = results.length - shown.length;
  return (
    <ul data-slot='message-reasoning-results' aria-label={label} className={cn('flex flex-wrap gap-1.5', className)}>
      {shown.map((result) => {
        const site = siteOf(result);
        const chip = 'bg-surface-muted text-text-muted inline-flex max-w-full items-center gap-1.5 rounded-(--ds-radius-control) border px-2 py-0.5 text-xs';
        const body = (
          <>
            <SourceIcon source={result} className='size-3.5' />
            <span className='truncate'>{result.title || site}</span>
            {result.title && site ? <span className='text-text-subtle hidden truncate sm:inline'>{site}</span> : null}
          </>
        );
        return (
          <li key={result.url || result.title} className='max-w-full min-w-0'>
            {result.url ? (
              <a href={result.url} target='_blank' rel='noopener noreferrer' className={cn(chip, 'hover:text-accent hover:bg-accent-subtle focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none')}>
                {body}
              </a>
            ) : (
              <span className={chip}>{body}</span>
            )}
          </li>
        );
      })}
      {more > 0 ? <li className='text-text-muted self-center text-xs'>{`+${more} more`}</li> : null}
    </ul>
  );
}

/** An image a step looked at, as a thumbnail with an optional caption. `alt` describes it. */
function MessageReasoningImage({ src, alt = '', caption, className }) {
  return (
    <figure data-slot='message-reasoning-image' className={cn('grid w-full max-w-xs gap-1', className)}>
      <img src={src} alt={alt} loading='lazy' className='bg-surface-muted aspect-video w-full rounded-(--ds-radius-card) border object-cover' />
      {caption ? <figcaption className='text-text-muted text-xs'>{caption}</figcaption> : null}
    </figure>
  );
}

export { MessageReasoning, MessageReasoningImage, MessageReasoningResults, MessageReasoningStep, useReasoningDisclosure };
