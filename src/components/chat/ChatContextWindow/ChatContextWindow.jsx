'use client';
import { useId, useRef, useState } from 'react';
import Button from '../../core/Button/index.js';
import { Badge } from '../../core/Pill/index.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../core/Accordion/index.js';
import { Toggle } from '../../core/ToggleGroup/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { cn } from '../../../utilities/cn/index.js';

const formatCount = value => new Intl.NumberFormat().format(value);
const formatPercent = value => value.toFixed(1);
const categoryColor = part => part.color ?? 'var(--ds-color-chart-1)';

function ContextFiles({ part, row, formatTokens, disabled, onRemoveFile }) {
  const [filesOpen, setFilesOpen] = useState(true);
  const filesTrigger = useRef(null);
  return (
<Collapsible open={filesOpen} onOpenChange={setFilesOpen}>
              <CollapsibleTrigger asChild><Button ref={filesTrigger} size='sm' variant='ghost' className='w-full justify-start gap-2 whitespace-normal py-2'>{row(part)}<RegistryIcon lucide={filesOpen ? 'ChevronUp' : 'ChevronDown'} className='size-3.5' /></Button></CollapsibleTrigger>
              <CollapsibleContent>
                {part.files.length ? <ul aria-label={`${part.label} in context`} className='grid gap-1 ps-4 py-1'>
                  {part.files.map((file) => <li key={file.id} className='flex min-w-0 items-start gap-2 py-1'>
                    <div className='grid min-w-0 flex-1 gap-0.5'><bdi className='wrap-anywhere text-xs'>{file.name}</bdi><bdi className='text-xs tabular-nums text-text-muted'>{formatTokens(file.tokens)} tokens</bdi></div>
                    {onRemoveFile && <Button size='icon-sm' variant='ghost' disabled={disabled || file.disabled} aria-label={`Remove ${file.name}`} onClick={() => { onRemoveFile(file.id, part.id); filesTrigger.current?.focus(); }}><RegistryIcon lucide='X' className='size-3.5' /></Button>}
                  </li>)}
                </ul> : <p className='px-2 py-2 text-xs text-text-muted'>No files in this context.</p>}
              </CollapsibleContent>
            </Collapsible>
  );
}

/** Prepared context capacity with keyboard/pointer highlighting. Compaction and token accounting stay in the host. */
export function ChatContextWindow({ title = 'Context window', description, parts = [], usedTokens = 0, maxTokens = 0, tone = 'accent', formatTokens = formatCount, formatPercentage = formatPercent, onRemoveFile, disabled = false, hint = 'Hover, focus or select a category to highlight its cells.', footer, className }) {
  const titleId = useId();
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const active = hovered ?? focused ?? selected;
  const activePart = parts.find(part => part.id === active);
  let allocated = 0;
  const ranges = parts.map(part => { const start = maxTokens > 0 ? Math.round(allocated / maxTokens * 100) : 0; allocated += Math.max(0, part.tokens); return { ...part, start, end: maxTokens > 0 ? Math.round(allocated / maxTokens * 100) : 0 }; });
  const highlight = (id) => ({
    onPointerEnter: (event) => { if (event.pointerType === 'mouse') setHovered(id); },
    onPointerLeave: () => setHovered(null),
    onFocusCapture: () => setFocused(id),
    onBlurCapture: (event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null); }
  });
  const row = (part) => <><span aria-hidden='true' className='size-2 shrink-0 rounded-xs' style={{ backgroundColor: categoryColor(part) }} /><span className='min-w-0 flex-1 text-start'>{part.label}</span><bdi className='shrink-0 tabular-nums text-text-muted'>{formatTokens(part.tokens)}</bdi></>;

  return (
      <section aria-labelledby={titleId} data-slot='chat-context-window' className={cn('ds-touch-controls grid w-full min-w-0 gap-4 rounded-(--ds-radius-card) border border-border bg-surface p-4 text-sm', className)}>
        <header className='flex flex-wrap items-center justify-between gap-2'><h2 id={titleId} className='text-base font-semibold'>{title}</h2>{description && <span className='text-xs text-text-muted'>{description}</span>}</header>
        <div className='flex flex-wrap items-baseline justify-between gap-2'>
          <p><bdi dir='ltr'><strong className='text-xl font-semibold tabular-nums'>{formatTokens(usedTokens)}</strong><span className='text-text-muted'> / {formatTokens(maxTokens)} tokens</span></bdi></p>
          <Badge tone={tone === 'accent' ? 'neutral' : tone} variant='soft'><bdi dir='ltr'>{formatPercentage(maxTokens > 0 ? usedTokens / maxTokens * 100 : 0)}% used</bdi></Badge>
        </div>
        <div aria-hidden='true' data-context-cells className='grid grid-cols-20 gap-0.5'>
          {Array.from({ length: 100 }, (_, index) => {
            const part = ranges.find((item) => index >= item.start && index < item.end);
            return <span key={index} data-part={part?.id ?? 'available'} className={`aspect-square rounded-xs transition-opacity duration-150 motion-reduce:transition-none ${part?.busy ? 'motion-safe:animate-pulse' : ''}`} style={{ backgroundColor: part ? categoryColor(part) : 'var(--ds-color-surface-muted)', opacity: active != null && part?.id !== active ? .25 : 1 }} />;
          })}
        </div>
        <p className='text-xs text-text-muted'>Each cell is approximately 1% of capacity. Exact counts are below.</p>
        <ul aria-label='Context breakdown' className='grid min-w-0 gap-1'>
          {parts.map((part) => <li key={part.id} className='min-w-0' {...highlight(part.id)}>
            {Array.isArray(part.files) ? <ContextFiles part={part} row={row} formatTokens={formatTokens} disabled={disabled} onRemoveFile={onRemoveFile} /> : (
              <Toggle size='sm' pressed={selected === part.id} onPressedChange={(pressed) => setSelected(pressed ? part.id : null)} className='h-auto min-h-8 w-full justify-start gap-2 whitespace-normal px-2.5 py-2'>{row(part)}</Toggle>
            )}
            {part.actions != null && <div className='flex flex-wrap items-center gap-2 px-2.5 pb-2'>{part.actions}</div>}
          </li>)}
        </ul>
        <p className='min-h-10 text-xs text-text-muted'>{activePart ? activePart.detail : hint}</p>
        {footer && <div className='flex flex-wrap items-center justify-between gap-3 border-t pt-3'>{footer}</div>}
      </section>
  );
}
