'use client';

/**
 * LinkPreview parts
 *
 * @description Presentation for a normalised link preview (see
 * `normalizeLinkPreview`). Every part takes the same `preview` model, so the
 * hover card, the card and the compact row show the same rich information.
 */

import { useEffect, useState } from 'react';

import { cn } from '../../../utilities/cn/index.js';
import Icon from '../Icon';
import Link from '../Link';
import Pill from '../Pill';
import Skeleton from '../Skeleton';
import { Card as CardRoot } from '../Card/CardPrimitives.jsx';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../Item/Item.jsx';

const headingTags = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' };

/** A 16px favicon that falls back to the kind's registry icon when it is missing or fails. */
function LinkPreviewFavicon({ src, icon = 'Globe', className, iconClassName }) {
  const [ failed, setFailed ] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [ src ]);

  if (!src || failed) return <Icon name={ icon } size='sm' decorative className={ cn('shrink-0 text-text-subtle', iconClassName, className) } />;

  return (
    <img
      data-slot='link-preview-favicon'
      className={ cn('size-4 shrink-0 rounded-sm object-contain', className) }
      src={ src }
      width={ 16 }
      height={ 16 }
      alt=''
      onError={ () => setFailed(true) }
    />
  );
}

/** The preview image with a pulse placeholder; video previews add a play badge and duration. */
function LinkPreviewMedia({ preview, className, imageClassName }) {
  const [ loaded, setLoaded ] = useState(false);
  const [ failed, setFailed ] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [ preview.image ]);

  if (!preview.image || failed) return null;

  return (
    <div data-slot='link-preview-media' className={ cn('relative overflow-hidden bg-surface-muted', className) }>
      {loaded ? null : (
        <div className='absolute inset-0 flex animate-pulse items-center justify-center' aria-hidden='true'>
          <Icon name='PhotoIcon' size='xl' decorative className='text-text-subtle' />
        </div>
      )}
      <img
        src={ preview.image }
        alt={ preview.kind === 'image' ? preview.imageAlt || preview.title : '' }
        className={ cn('size-full object-cover', preview.kind === 'image' && 'object-contain', imageClassName) }
        loading='lazy'
        onLoad={ () => setLoaded(true) }
        onError={ () => setFailed(true) }
      />
      {preview.kind === 'video' ? (
        <>
          <span className='absolute inset-0 flex items-center justify-center' aria-hidden='true'>
            <span className='flex size-10 items-center justify-center rounded-control bg-surface/95 text-accent shadow-md'>
              <Icon name='Play' size='sm' decorative className='translate-x-px fill-current' />
            </span>
          </span>
          {preview.duration ? (
            <span className='absolute right-2 bottom-2 rounded-sm bg-surface-dark/85 px-1.5 py-0.5 font-mono text-xs text-text-inverse'>{preview.duration}</span>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/** Repository stats, post counts, author, date, reading time and duration as one wrapped row. */
function LinkPreviewMeta({ preview, className, exclude = [] }) {
  const items = [ ...preview.stats, ...preview.meta ].filter((item) => !exclude.includes(item.id));

  if (!items.length) return null;

  return (
    <ul data-slot='link-preview-meta' className={ cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted', className) }>
      {items.map((item) => (
        <li key={ item.id } className='inline-flex min-w-0 items-center gap-1'>
          {item.icon ? <Icon name={ item.icon } size='xs' decorative /> : null}
          {item.label === item.text ? <span className='truncate'>{item.text}</span> : (
            <>
              <span className='truncate' aria-hidden='true'>{item.text}</span>
              <span className='sr-only'>{item.label}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Up to five tags, with a count for the rest. */
function LinkPreviewTags({ tags = [], limit = 5 }) {
  if (!tags.length) return null;

  return (
    <div data-slot='link-preview-tags' className='flex flex-wrap gap-2'>
      {tags.slice(0, limit).map((tag) => (
        <Pill key={ tag } tone='gray' variant='soft' size='xs' radius='md' className='my-1 mr-1 normal-case tracking-normal'>{tag}</Pill>
      ))}
      {tags.length > limit ? <span className='self-center text-xs text-text-muted'>+{tags.length - limit} more</span> : null}
    </div>
  );
}

/**
 * The rich body of a preview: media, site and kind, title, description or
 * excerpt, tags and metadata. `linked` turns the title into the link (cards);
 * inside a hover card the trigger is already the link.
 */
function LinkPreviewBody({ preview, orientation = 'vertical', linked = false, headingLevel = 3, showImage = true, className }) {
  const Heading = headingTags[headingLevel] || 'h3';
  const horizontal = orientation === 'horizontal';
  const media = showImage && preview.image && preview.kind !== 'wikipedia' ? (
    <LinkPreviewMedia
      preview={ preview }
      className={ horizontal ? 'w-28 shrink-0 self-stretch sm:w-44' : 'aspect-[1.91/1] w-full' }
    />
  ) : null;
  const title = linked ? (
    <Link href={ preview.url } tone='neutral' className='after:absolute after:inset-0 focus-visible:ring-offset-0'>{preview.title}</Link>
  ) : preview.title;

  return (
    <article
      data-slot='link-preview-body'
      data-kind={ preview.kind }
      data-orientation={ orientation }
      className={ cn('relative flex min-w-0 text-text', horizontal ? 'flex-row' : 'flex-col', className) }
    >
      {media}
      <div className={ cn('flex min-w-0 flex-1 flex-col gap-2 p-4', preview.kind === 'wikipedia' && 'bg-surface-muted') }>
        {preview.internal ? (
          // App links lead with their category; the site is the reader's own.
          preview.label && preview.label !== 'Post' ? <Pill tone='blue' variant='soft' size='xs' radius='md' className='my-1 mr-1 self-start'>{preview.label}</Pill> : null
        ) : (
          <div className='flex min-w-0 items-center gap-2 text-xs text-text-muted'>
            <LinkPreviewFavicon src={ preview.preferIcon ? null : preview.favicon } icon={ preview.icon } />
            <span className='min-w-0 truncate font-medium'>{preview.site}</span>
            {preview.label && preview.kind !== 'website' ? (
              <Pill tone='gray' variant='soft' size='xs' radius='md' className='my-1 mr-1 ml-auto shrink-0'>{preview.label}</Pill>
            ) : null}
          </div>
        )}
        <Heading className={ cn('line-clamp-2 font-semibold', preview.internal ? 'text-base' : 'text-sm') }>{title}</Heading>
        {preview.kind === 'social' && preview.author ? <p className='-mt-1 text-xs text-text-muted'>{preview.author}</p> : null}
        {preview.description ? <p className={ cn('text-xs text-text-muted', preview.kind === 'social' ? 'line-clamp-4 text-sm text-text' : 'line-clamp-2') }>{preview.description}</p> : null}
        {preview.excerpt ? <p className='line-clamp-5 text-xs leading-relaxed'>{preview.excerpt}</p> : null}
        <LinkPreviewTags tags={ preview.tags } />
        <LinkPreviewMeta preview={ preview } exclude={ preview.kind === 'video' && media ? [ 'duration' ] : [] } />
      </div>
    </article>
  );
}

/** A standalone preview card: a Card surface whose title links to the destination. */
function LinkPreviewCard({ preview, orientation = 'vertical', headingLevel = 3, showImage = true, className, ...props }) {
  return (
    <CardRoot
      data-slot='link-preview-card'
      data-preview-url={ preview.url }
      className={ cn('ds-part-link-preview-card relative gap-0 py-0 transition-shadow focus-within:ring-2 focus-within:ring-ui-primary hover:shadow-md', className) }
      { ...props }
    >
      <LinkPreviewBody preview={ preview } orientation={ orientation } headingLevel={ headingLevel } showImage={ showImage } linked />
    </CardRoot>
  );
}

/** A one-line row: favicon, title link, host and the leading metadata. */
function LinkPreviewCompact({ preview, className, ...props }) {
  const detail = [ preview.host || preview.site, ...[ ...preview.stats, ...preview.meta ].slice(0, 2).map((item) => item.text) ].filter(Boolean).join(' · ');

  return (
    <Item
      data-slot='link-preview-compact'
      data-kind={ preview.kind }
      data-preview-url={ preview.url }
      variant='outline'
      size='sm'
      className={ cn('relative flex-nowrap focus-within:ring-2 focus-within:ring-ui-primary', className) }
      { ...props }
    >
      <ItemMedia variant='icon'>
        <LinkPreviewFavicon src={ preview.preferIcon ? null : preview.favicon } icon={ preview.icon } />
      </ItemMedia>
      <ItemContent className='min-w-0'>
        <ItemTitle className='w-full min-w-0'>
          <Link href={ preview.url } tone='neutral' className='truncate after:absolute after:inset-0 focus-visible:ring-offset-0'>{preview.title}</Link>
        </ItemTitle>
        {detail ? <ItemDescription className='truncate text-xs'>{detail}</ItemDescription> : null}
      </ItemContent>
      {preview.label && preview.kind !== 'website' ? <Pill tone='gray' variant='soft' size='xs' radius='md' className='my-1 mr-1 shrink-0 max-sm:hidden'>{preview.label}</Pill> : null}
    </Item>
  );
}

/** Loading placeholders that hold each variant's space. */
function LinkPreviewSkeleton({ variant = 'inline', orientation = 'vertical', className }) {
  if (variant === 'inline') return (
    <span data-slot='link-preview-skeleton' className={ cn('inline-flex items-start gap-1', className) } aria-hidden='true'>
      <Skeleton as='span' className='inline-block size-4 shrink-0' />
      <Skeleton as='span' className='inline-block h-4 w-32' />
    </span>
  );

  if (variant === 'compact') return (
    <div data-slot='link-preview-skeleton' className={ cn('flex items-center gap-3 rounded-md border border-border p-3', className) } aria-hidden='true'>
      <Skeleton className='size-4 shrink-0' />
      <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
        <Skeleton className='h-3.5 w-2/3' />
        <Skeleton className='h-3 w-1/3' />
      </div>
    </div>
  );

  return (
    <div data-slot='link-preview-skeleton' className={ cn('flex overflow-hidden rounded-md border border-border', orientation === 'horizontal' ? 'flex-row' : 'flex-col', className) } aria-hidden='true'>
      <Skeleton className={ cn('rounded-none', orientation === 'horizontal' ? 'w-28 shrink-0 self-stretch sm:w-44' : 'aspect-[1.91/1] w-full') } />
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <Skeleton className='h-3 w-24' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-full' />
      </div>
    </div>
  );
}

export {
  LinkPreviewBody,
  LinkPreviewCard,
  LinkPreviewCompact,
  LinkPreviewFavicon,
  LinkPreviewMedia,
  LinkPreviewMeta,
  LinkPreviewSkeleton,
  LinkPreviewTags
};
