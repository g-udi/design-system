'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../Accordion/parts/collapsible.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { MessageStatusIcon } from './message-status.jsx';

const AUTO_CLOSE_DELAY = 1000;

/**
 * Open while the model is thinking, then folds itself away a moment after `streaming` ends so the answer
 * leads. A reader who toggles it keeps their choice; a controlled `open` always wins.
 */
function useReasoningDisclosure({ streaming = false, defaultOpen = true, open, onOpenChange }) {
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
    const finished = wasStreaming.current && !streaming;
    wasStreaming.current = streaming;
    if (!finished || chosen.current || !isOpen) return undefined;
    const timer = setTimeout(() => request(false, false), AUTO_CLOSE_DELAY);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming]);
  return { isOpen, setOpen: (next) => request(next, true) };
}

const formatDuration = (seconds) => (seconds < 60 ? `${Math.max(1, Math.round(seconds))}s` : `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`);

/** The "thinking" disclosure; children are MessageReasoningStep rows or free text. */
function MessageReasoning({ streaming = false, duration, label, defaultOpen = true, open, onOpenChange, className, children }) {
  const { isOpen, setOpen } = useReasoningDisclosure({ streaming, defaultOpen, open, onOpenChange });
  const title = label || (streaming ? 'Thinking' : duration != null ? `Thought for ${formatDuration(duration)}` : 'Reasoning');
  return (
    <Collapsible open={isOpen} onOpenChange={setOpen} data-slot='message-reasoning' data-streaming={streaming || undefined} className={cn('ds-part-message-reasoning grid gap-2', className)}>
      <CollapsibleTrigger className='text-text-muted hover:text-text focus-visible:ring-accent group/reasoning inline-flex w-fit items-center gap-1.5 rounded-(--ds-radius-control) text-xs font-medium focus-visible:ring-2 focus-visible:outline-none'>
        <RegistryIcon lucide='Brain' className='size-3.5' />
        <span className={cn(streaming && 'ds-part-message-shimmer')}>{title}</span>
        <RegistryIcon lucide='ChevronDown' className={cn('size-3.5 transition-transform motion-reduce:transition-none', isOpen && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='text-text-muted border-border grid gap-2 border-s-2 ps-3 text-sm leading-relaxed'>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/** One step of the reasoning trail: `status` pending, running, done or failed. */
function MessageReasoningStep({ status = 'done', className, children }) {
  return (
    <div data-slot='message-reasoning-step' data-status={status} className={cn('flex items-start gap-2', className)}>
      <MessageStatusIcon status={status} className='mt-0.5' />
      <div className='min-w-0'>{children}</div>
    </div>
  );
}

export { MessageReasoning, MessageReasoningStep, useReasoningDisclosure };
