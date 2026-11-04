'use client';
import { useId, useRef, useState } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useCopyToClipboard } from '../../../hooks/interaction/use-copy-to-clipboard.js';
import { cn } from '../../../utilities/cn/index.js';
import Button from '../../core/Button/index.js';
import Link from '../../core/Link/Link.jsx';
import { Collapsible, CollapsibleContent } from '../../core/Accordion/Collapsible.jsx';
import { ToggleGroup, ToggleGroupItem } from '../../core/ToggleGroup/ToggleGroupPrimitives.jsx';
import { TextHighlight } from '../../core/TextHighlight/TextHighlight.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { ChatSourceIcon, siteOf } from '../shared/source.jsx';

const defaultLabels = {
  answer: 'Answer with citations', sources: 'Sources', preview: 'Source passage', close: 'Close source',
  copy: 'Copy quote', copied: 'Quote copied.', copyFailed: 'Could not copy. Select the quote and copy it manually.',
  open: 'Open source', hint: 'Choose a citation to inspect its source.',
  trigger: (number, title) => `Source ${number}: ${title}`,
  selected: (number, title, count) => `Source ${number}: ${title}. Cited in ${count} ${count === 1 ? 'passage' : 'passages'}.`
};

// Highlight only the exact phrases supplied by the host; never infer supporting evidence.
function Quote({ text, highlights = [] }) {
  const phrases = highlights.filter(Boolean).sort((a, b) => b.length - a.length);
  const parts = [];
  let cursor = 0;
  while (cursor < text.length) {
    let start = text.length;
    let match = '';
    for (const phrase of phrases) {
      const index = text.indexOf(phrase, cursor);
      if (index !== -1 && index < start) { start = index; match = phrase; }
    }
    if (start > cursor) parts.push(text.slice(cursor, start));
    if (!match) break;
    parts.push(<TextHighlight key={start} variant='soft' animate={false} className='px-0'>{match}</TextHighlight>);
    cursor = start + match.length;
  }
  return parts;
}

/** Finished answer with source-linked passages and one inline evidence disclosure. */
export function ChatCitedAnswer({ segments = [], sources = [], openSourceId, defaultOpenSourceId = null, onOpenSourceChange, labels: overrides, className }) {
  const labels = { ...defaultLabels, ...overrides };
  const uid = useId();
  const previewId = `${uid}-passage`;
  const headingId = `${uid}-source`;
  const [selectedId, setSelectedId] = useControllableState({ value: openSourceId, defaultValue: defaultOpenSourceId, onChange: onOpenSourceChange });
  const [hoveredId, setHoveredId] = useState(null);
  const [focusedId, setFocusedId] = useState(null);
  const [copyNotice, setCopyNotice] = useState(null);
  const sourceButtons = useRef(new Map());
  const sourceMap = new Map(sources.map((source, index) => [source.id, { ...source, number: index + 1 }]));
  const selected = sourceMap.get(selectedId);
  const active = sourceMap.get(hoveredId) || sourceMap.get(focusedId) || selected;
  const { copy } = useCopyToClipboard({
    onCopy: () => setCopyNotice(labels.copied),
    onError: () => setCopyNotice(labels.copyFailed)
  });
  const paragraphs = [];
  for (const segment of segments) {
    if (!paragraphs.length || segment.paragraph) paragraphs.push([]);
    paragraphs.at(-1).push(segment);
  }
  const select = (id) => { setCopyNotice(null); setSelectedId(id || null); };
  const close = () => {
    const id = selected?.id;
    select(null);
    sourceButtons.current.get(id)?.focus();
  };
  const highlightEvents = (id) => ({
    onPointerEnter: (event) => { if (event.pointerType === 'mouse') setHoveredId(id); },
    onPointerLeave: () => setHoveredId(null),
    onFocus: () => setFocusedId(id),
    onBlur: () => setFocusedId(null)
  });
  const quote = selected?.quote || selected?.excerpt;
  const count = active ? segments.filter(segment => segment.sourceIds?.includes(active.id)).length : 0;

  return (
    <section data-slot='cited-answer' aria-label={labels.answer} className={cn('ds-touch-controls grid min-w-0 gap-4 text-sm', className)}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && selected) { event.preventDefault(); event.stopPropagation(); close(); }
      }}>
      <div className='grid gap-4 leading-relaxed'>
        {paragraphs.map(paragraph => (
          <p key={paragraph[0].id} className='m-0 wrap-anywhere'>
            {paragraph.map(segment => {
              const citations = [...new Set(segment.sourceIds || [])].map(id => sourceMap.get(id)).filter(Boolean);
              const highlighted = Boolean(active && citations.some(source => source.id === active.id));
              return (
                <span key={segment.id} data-slot='cited-answer-segment' data-highlighted={highlighted || undefined} className={cn('box-decoration-clone whitespace-pre-wrap', highlighted && 'bg-accent-subtle underline decoration-accent/40 underline-offset-4')}>
                  {segment.text}
                  {citations.map(source => (
                    <Button key={source.id} size='xs' variant='ghost' {...highlightEvents(source.id)}
                      aria-label={labels.trigger(source.number, source.title)} aria-expanded={selected?.id === source.id} aria-controls={previewId}
                      onClick={() => select(selected?.id === source.id ? null : source.id)}
                      className={cn('mx-0.5 inline-flex h-6 min-w-6 px-1 align-baseline text-xs tabular-nums', active?.id === source.id ? 'bg-accent-subtle text-accent' : 'bg-surface-muted text-text-muted')}>
                      {source.number}
                    </Button>
                  ))}
                </span>
              );
            })}
          </p>
        ))}
      </div>
      {sources.length ? (
        <Collapsible open={Boolean(selected)} className='grid min-w-0 gap-3'>
          <ToggleGroup type='single' value={selected?.id || ''} onValueChange={select} aria-label={labels.sources} size='sm' variant='outline' className='max-w-full flex-wrap'>
            {sources.map((source, index) => (
              <ToggleGroupItem key={source.id} value={source.id} ref={node => { if (node) sourceButtons.current.set(source.id, node); else sourceButtons.current.delete(source.id); }}
                {...highlightEvents(source.id)} aria-label={labels.trigger(index + 1, source.title)}
                aria-controls={previewId}
                className={cn('h-auto min-h-8 max-w-full shrink gap-1.5 py-1.5 text-start whitespace-normal', active?.id === source.id && 'bg-accent-subtle text-accent')}>
                <span className='shrink-0 tabular-nums'>{index + 1}</span>
                <ChatSourceIcon source={source} />
                <span className='min-w-0 wrap-anywhere'>{siteOf(source) || source.title}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <CollapsibleContent id={previewId} role='region' aria-label={labels.preview}>
            {selected ? <div className='bg-surface-muted grid min-w-0 gap-3 rounded-(--ds-radius) p-3'>
              <div className='flex items-start justify-between gap-2'>
                <div className='grid min-w-0 gap-1'>
                  <p id={headingId} className='m-0 font-medium wrap-anywhere'>{selected.title}</p>
                  <p className='text-text-muted m-0 text-xs wrap-anywhere'>{[siteOf(selected), selected.date].filter(Boolean).join(' · ')}</p>
                </div>
                <Button variant='ghost' size='icon-xs' aria-label={labels.close} onClick={close}><RegistryIcon lucide='X' /></Button>
              </div>
              {quote ? <blockquote aria-labelledby={headingId} className='m-0 whitespace-pre-wrap wrap-anywhere leading-relaxed'><Quote text={quote} highlights={selected.highlights} /></blockquote> : null}
              {quote || selected.url ? <div className='flex flex-wrap items-center justify-between gap-2'>
                {quote ? <Button size='sm' variant='outline' onClick={() => copy(quote)}><RegistryIcon lucide='Copy' />{labels.copy}</Button> : null}
                {selected.url ? <Link href={selected.url} tone='accent' className='inline-flex items-center gap-1 text-xs'>{labels.open}<RegistryIcon lucide='ExternalLink' className='size-3' /><span className='sr-only'>{`: ${selected.title}`}</span></Link> : null}
              </div> : null}
            </div> : null}
          </CollapsibleContent>
          <p role='status' aria-live='polite' aria-atomic='true' className='text-text-muted m-0 min-h-4 text-xs wrap-anywhere'>
            {copyNotice || (active ? labels.selected(active.number, active.title, count) : labels.hint)}
          </p>
        </Collapsible>
      ) : null}
    </section>
  );
}
