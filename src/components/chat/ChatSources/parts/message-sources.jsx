'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../../core/Carousel/parts/carousel.jsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../core/Accordion/parts/collapsible.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../../../core/Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { SourceIcon, siteOf } from '../../shared/source.jsx';

/*
 * A source is `{ title, url?, kind?: 'web' | 'document', site?, excerpt?, quote?, icon? }`. Citations in the
 * reply are numbered from the same list, so marker [2] and the second row of MessageSources name the same
 * thing. The inline citation's hover card and carousel are adapted from AI SDK Elements (MIT, Copyright (c)
 * 2023 Vercel, Inc.).
 */

const HOVER_OPEN_DELAY = 150;
const HOVER_CLOSE_DELAY = 250;

function CitationCard({ source }) {
  const site = siteOf(source);
  const quote = source.quote || source.excerpt;
  return (
    <div className='flex items-start gap-2'>
      <SourceIcon source={source} className='mt-0.5' />
      <div className='grid min-w-0 gap-1'>
        <p className='m-0 text-sm font-medium break-words'>{source.title}</p>
        {site ? <p className='text-text-muted m-0 truncate text-xs'>{site}</p> : null}
        {quote ? <blockquote className='text-text-muted border-border m-0 border-s-2 ps-2 text-xs'>{quote}</blockquote> : null}
        {source.url ? (
          <a href={source.url} target='_blank' rel='noopener noreferrer' className='text-accent focus-visible:ring-accent mt-1 inline-flex w-fit items-center gap-1 rounded-(--ds-radius-control) text-xs font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none'>
            Open source <RegistryIcon lucide='ExternalLink' className='size-3' />
            <span className='sr-only'>{`: ${source.title}`}</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}

function CitationCarousel({ sources, labels }) {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) return undefined;
    const update = () => setCurrent(api.selectedScrollSnap());
    update();
    api.on('select', update);
    api.on('reInit', update);
    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);
  return (
    <Carousel setApi={setApi} aria-label={labels.carousel} className='grid gap-2'>
      <div className='flex items-center justify-between gap-2'>
        <p aria-live='polite' className='text-text-muted m-0 text-xs tabular-nums'>{labels.position(current + 1, sources.length)}</p>
        <div className='flex gap-1'>
          <CarouselPrevious aria-label={labels.previous} size='icon-xs' variant='ghost' className='static inset-auto m-0' />
          <CarouselNext aria-label={labels.next} size='icon-xs' variant='ghost' className='static inset-auto m-0' />
        </div>
      </div>
      <CarouselContent>
        {sources.map((source, index) => (
          <CarouselItem key={source.url || source.title} aria-label={labels.position(index + 1, sources.length)}>
            <CitationCard source={source} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

const defaultCitationLabels = {
  trigger: (index, first, more) => `Source ${index}: ${first}${more ? `, and ${more} more` : ''}`,
  carousel: 'Cited sources',
  position: (current, total) => `${current} of ${total}`,
  previous: 'Previous source',
  next: 'Next source'
};

/**
 * Inline numbered pill for a citation. It opens a card with the source's title, site and quote on hover,
 * click, tap or Enter; several `sources` behind one pill page through a carousel (arrow keys, buttons or
 * swipe). `source` is the single-source shorthand.
 */
function MessageCitation({ index, source, sources: list, labels: labelOverrides, className }) {
  const labels = { ...defaultCitationLabels, ...labelOverrides };
  const sources = list?.length ? list : source ? [source] : [];
  const [open, setOpen] = useState(false);
  const openedBy = useRef(null);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  if (!sources.length) return null;
  const more = sources.length - 1;

  // Hover opens it for a mouse without taking focus; a click pins it open; keyboard and touch toggle it.
  const hoverIn = (event) => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(timer.current);
    if (open) return;
    timer.current = setTimeout(() => {
      openedBy.current = 'hover';
      setOpen(true);
    }, HOVER_OPEN_DELAY);
  };
  const hoverOut = (event) => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(timer.current);
    if (openedBy.current === 'hover') timer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        clearTimeout(timer.current);
        openedBy.current = next ? openedBy.current || 'press' : null;
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type='button'
          data-slot='message-citation'
          aria-label={labels.trigger(index, sources[0].title, more)}
          onPointerEnter={hoverIn}
          onPointerLeave={hoverOut}
          onClick={(event) => {
            if (open && openedBy.current === 'hover') {
              event.preventDefault();
              openedBy.current = 'press';
            }
          }}
          className={cn(
            'ds-part-message-citation bg-surface-muted text-text-muted hover:bg-accent-subtle hover:text-accent focus-visible:ring-accent data-[state=open]:bg-accent-subtle data-[state=open]:text-accent mx-0.5 inline-flex h-4 min-w-4 -translate-y-px items-center justify-center gap-0.5 rounded-sm px-1 align-middle text-xs leading-none font-medium tabular-nums focus-visible:ring-2 focus-visible:outline-none',
            className
          )}
        >
          {index}
          {more ? <span>{`+${more}`}</span> : null}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-72 max-w-[calc(100vw-2rem)]'
        onPointerEnter={hoverIn}
        onPointerLeave={hoverOut}
        onOpenAutoFocus={(event) => {
          if (openedBy.current === 'hover') event.preventDefault();
        }}
      >
        {sources.length > 1 ? <CitationCarousel sources={sources} labels={labels} /> : <CitationCard source={sources[0]} />}
      </PopoverContent>
    </Popover>
  );
}

/** One row in the sources list. */
function MessageSource({ source, index, className }) {
  const site = siteOf(source);
  const body = (
    <>
      <span className='text-text-muted w-4 shrink-0 text-xs tabular-nums'>{index}</span>
      <SourceIcon source={source} />
      <span className='grid min-w-0'>
        <span className='truncate text-sm'>{source.title}</span>
        {site ? <span className='text-text-muted truncate text-xs'>{site}</span> : null}
      </span>
    </>
  );
  const rowClass = cn('ds-part-message-source flex min-w-0 items-center gap-2 rounded-(--ds-radius-control) px-2 py-1.5', className);
  return (
    <li data-slot='message-source'>
      {source.url ? (
        <a href={source.url} target='_blank' rel='noopener noreferrer' className={cn(rowClass, 'hover:bg-surface-muted focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none')}>
          {body}
        </a>
      ) : (
        <div className={rowClass}>{body}</div>
      )}
    </li>
  );
}

/** Collapsible "N sources" list under a reply; favicons preview the first few while it is closed. */
function MessageSources({ sources = [], label, defaultOpen = false, open, onOpenChange, className }) {
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = open ?? internal;
  if (!sources.length) return null;
  const title = label || `${sources.length} ${sources.length === 1 ? 'source' : 'sources'}`;
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(next) => {
        setInternal(next);
        onOpenChange?.(next);
      }}
      data-slot='message-sources'
      className={cn('ds-part-message-sources grid gap-1', className)}
    >
      <CollapsibleTrigger className='text-text-muted hover:text-text focus-visible:ring-accent inline-flex w-fit items-center gap-2 rounded-(--ds-radius-control) text-xs font-medium focus-visible:ring-2 focus-visible:outline-none'>
        <span className='flex -space-x-1' aria-hidden='true'>
          {sources.slice(0, 3).map((source, index) => (
            <span key={index} className='bg-surface ring-surface grid size-5 place-items-center rounded-full ring-2'>
              <SourceIcon source={source} className='size-3.5' />
            </span>
          ))}
        </span>
        {title}
        <RegistryIcon lucide='ChevronDown' className={cn('size-3.5 transition-transform motion-reduce:transition-none', isOpen && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ol className='grid gap-0.5'>
          {sources.map((source, index) => <MessageSource key={source.url || source.title} source={source} index={index + 1} />)}
        </ol>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { MessageCitation, MessageSource, MessageSources };
