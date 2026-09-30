import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../../../../src/components/core/Pagination/parts/pagination.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const pages = [1, 2, 3, null, 10];
const current = 2;
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
function Arrow({ direction, className }) {
  const next = direction === 'next';
  return (
    <PaginationLink
      href='#'
      size='icon'
      aria-label={next ? 'Go to next page' : 'Go to previous page'}
      className={className}
    >
      <RegistryIcon lucide={next ? 'ChevronRightIcon' : 'ChevronLeftIcon'} className='ds-part-rtl-flip size-4' />
    </PaginationLink>
  );
}
function Pages({ name, style }) {
  const edge = style.link.includes('rounded-full') ? 'rounded-full' : style.content ? 'rounded-none border-0 border-e border-border' : '';
  const nav = (
    <Pagination aria-label={`${name} pagination`} className='justify-start'>
      <PaginationContent className={style.content ?? 'gap-1'}>
        <PaginationItem>
          {style.icons ? <Arrow direction='previous' className={edge} /> : <PaginationPrevious href='#' className={edge} />}
        </PaginationItem>
        {pages.map((page, index) => (
          <PaginationItem key={page ?? `gap-${index}`} className={page ? undefined : style.item}>
            {page ? (
              <PaginationLink href='#' isActive={page === current} className={style.link}>
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          {style.icons ? <Arrow direction='next' className={style.content ? 'rounded-none border-0' : edge} /> : <PaginationNext href='#' className={edge} />}
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
    <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3'>
      {Object.entries(styles).map(([name, style]) => (
        <div key={name} className='contents'>
          <span className='text-xs text-text-muted'>{name}</span>
          <Pages name={name} style={style} />
        </div>
      ))}
    </div>
  );
}
