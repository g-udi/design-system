'use client';
import { useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../Accordion/parts/collapsible.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../../Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

/*
 * A source is `{ title, url?, kind?: 'web' | 'document', site?, excerpt?, icon? }`. Citations in the reply
 * are numbered from the same list, so marker [2] and the second row of MessageSources name the same thing.
 */

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
};

function SourceIcon({ source, className }) {
  if (source.icon) return <img src={source.icon} alt='' className={cn('size-4 shrink-0 rounded-sm', className)} />;
  return <RegistryIcon lucide={source.kind === 'document' ? 'FileText' : 'Globe'} className={cn('text-text-muted size-4 shrink-0', className)} />;
}

/** Inline numbered chip for a citation; opens a popover with the source title, site and excerpt. */
function MessageCitation({ index, source, className }) {
  const site = source.site || hostOf(source.url);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type='button'
          data-slot='message-citation'
          aria-label={`Source ${index}: ${source.title}`}
          className={cn(
            'ds-part-message-citation bg-surface-muted text-text-muted hover:bg-accent-subtle hover:text-accent focus-visible:ring-accent mx-0.5 inline-flex h-4 min-w-4 -translate-y-px items-center justify-center rounded-sm px-1 align-middle text-xs leading-none font-medium tabular-nums focus-visible:ring-2 focus-visible:outline-none',
            className
          )}
        >
          {index}
        </button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-72'>
        <div className='flex items-start gap-2'>
          <SourceIcon source={source} className='mt-0.5' />
          <div className='grid min-w-0 gap-1'>
            <p className='text-sm font-medium'>{source.title}</p>
            {site ? <p className='text-text-muted truncate text-xs'>{site}</p> : null}
            {source.excerpt ? <p className='text-text-muted text-xs'>{source.excerpt}</p> : null}
            {source.url ? (
              <a href={source.url} target='_blank' rel='noopener noreferrer' className='text-accent mt-1 inline-flex items-center gap-1 text-xs font-medium underline-offset-4 hover:underline'>
                Open source <RegistryIcon lucide='ExternalLink' className='size-3' />
              </a>
            ) : null}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** One row in the sources list. */
function MessageSource({ source, index, className }) {
  const site = source.site || hostOf(source.url);
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
