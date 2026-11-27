'use client';
import { useState } from 'react';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import {
  getPageShortcuts,
  PaginationRoot as Pagination,
  PaginationContentPrimitive as PaginationContent,
  PaginationEllipsisPrimitive as PaginationEllipsis,
  PaginationItemPrimitive as PaginationItem,
  PaginationLinkPrimitive as PaginationLink,
  PaginationNextPrimitive as PaginationNext,
  PaginationPreviousPrimitive as PaginationPrevious
} from '@gaudi/design-system/core/Pagination';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const total = 10;
const styles = {
  Default: { link: '' },
  'Icon arrows': { link: '', icons: true },
  Circle: { link: 'rounded-full' },
  'Hover border': { link: 'hover:border hover:border-border' },
  Joined: {
    icons: true,
    content: 'gap-0 overflow-hidden rounded-control border border-border',
    link: 'rounded-none border-0 border-e border-border data-[active=true]:bg-surface-muted',
    item: 'border-e border-border'
  },
  Filled: {
    icons: true,
    card: true,
    link: 'data-[active=true]:border-transparent data-[active=true]:bg-accent data-[active=true]:text-accent-foreground'
  }
};
function Arrow({ direction, className, ...props }) {
  const next = direction === 'next';
  return (
    <PaginationLink
      {...props}
      size='icon'
      aria-label={next ? 'Go to next page' : 'Go to previous page'}
      className={className}
    >
      <RegistryIcon lucide={next ? 'ChevronRightIcon' : 'ChevronLeftIcon'} className='ds-part-rtl-flip size-4' />
    </PaginationLink>
  );
}
function Pages({ name, style }) {
  const [current, setCurrent] = useState(2);
  const pages = getPageShortcuts(current, total);
  const previous = { disabled: current === 1, onClick: () => setCurrent(current - 1) };
  const next = { disabled: current === total, onClick: () => setCurrent(current + 1) };
  const edge = style.link.includes('rounded-full') ? 'rounded-full' : style.content ? 'rounded-none border-0 border-e border-border' : '';
  const nav = (
    <Pagination aria-label={`${name} pagination`} className='justify-start'>
      <PaginationContent className={style.content ?? 'gap-1'}>
        <PaginationItem>
          {style.icons ? <Arrow {...previous} direction='previous' className={edge} /> : <PaginationPrevious {...previous} className={edge} />}
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem key={page} className={typeof page === 'number' ? undefined : style.item}>
            {typeof page === 'number' ? (
              <PaginationLink onClick={() => setCurrent(page)} isActive={page === current} className={style.link}>
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          {style.icons ? <Arrow {...next} direction='next' className={style.content ? 'rounded-none border-0' : edge} /> : <PaginationNext {...next} className={edge} />}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
  if (!style.card) return nav;
  return (
    <Card className='w-fit p-1.5'>
      <CardContent className='p-0'>{nav}</CardContent>
    </Card>
  );
}
export function Pattern() {
  return (
    <div className='mx-auto grid w-fit grid-cols-1 items-center gap-x-4 gap-y-2 sm:grid-cols-[auto_1fr] sm:gap-y-3'>
      {Object.entries(styles).map(([name, style]) => (
        <div key={name} className='contents'>
          <span className='text-xs text-text-muted'>{name}</span>
          <Pages name={name} style={style} />
        </div>
      ))}
    </div>
  );
}
