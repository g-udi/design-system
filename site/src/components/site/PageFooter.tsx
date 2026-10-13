import Link from 'next/link';
import type { Item } from 'fumadocs-core/page-tree';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';

const formatDate = (iso: string) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso));

function NeighbourCard({ item, direction }: { item: Item; direction: 'previous' | 'next' }) {
  const next = direction === 'next';
  return (
    <Link href={item.url} className={`site-card ${next ? 'sm:col-start-2 sm:items-end sm:text-end' : ''}`} data-plain rel={next ? 'next' : 'prev'}>
      <span className='inline-flex items-center gap-1 text-xs text-text-muted'>
        {next ? null : <Icon name='ArrowLeft' decorative size='xs' className='rtl:-scale-x-100' />}
        {next ? 'Next' : 'Previous'}
        {next ? <Icon name='ArrowRight' decorative size='xs' className='rtl:-scale-x-100' /> : null}
      </span>
      <span className='font-medium'>{item.name}</span>
    </Link>
  );
}

/** Bottom of a docs page: last updated (from git), Edit on GitHub (hand-written pages) and previous/next. */
export function PageFooter({ previous, next, lastModified, editUrl }: { previous?: Item; next?: Item; lastModified: string | null; editUrl: string | null }) {
  return (
    <footer className='not-prose mt-12 flex max-w-[52rem] flex-col gap-6' data-testid='page-footer'>
      {lastModified || editUrl ? (
        <div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-text-muted'>
          {lastModified ? <p className='inline-flex items-center gap-1.5'><Icon name='History' decorative size='sm' />Last updated <time dateTime={lastModified}>{formatDate(lastModified)}</time></p> : <span />}
          {editUrl ? (
            <Button href={editUrl} target='_blank' rel='noreferrer' variant='ghost' tone='neutral' size='sm'>
              <Icon name='Pencil' decorative size='sm' />
              Edit on GitHub
            </Button>
          ) : null}
        </div>
      ) : null}
      {previous || next ? (
        <nav aria-label='Previous and next pages' className='grid gap-3 sm:grid-cols-2'>
          {previous ? <NeighbourCard item={previous} direction='previous' /> : null}
          {next ? <NeighbourCard item={next} direction='next' /> : null}
        </nav>
      ) : null}
    </footer>
  );
}
