// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function Pagination({ className, ...props }) {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      data-slot='pagination'
      className={cn(
        'ds-part-pagination mx-auto flex w-full justify-center',
        className
      )}
      {...props}
    />
  );
}
function PaginationContent({ className, ...props }) {
  return (
    <ul
      data-slot='pagination-content'
      className={cn(
        'ds-part-pagination-content flex max-w-full flex-wrap items-center gap-y-2',
        className
      )}
      {...props}
    />
  );
}
function PaginationItem({ ...props }) {
  return <li data-slot='pagination-item' {...props} />;
}
function PaginationLink({ className, isActive, size = 'icon', ...props }) {
  return (
    <Button
      asChild
      variant={isActive ? 'outline' : 'ghost'}
      size={size}
      className={cn('ds-part-pagination-link', className)}
    >
      <a
        aria-current={isActive ? 'page' : void 0}
        data-slot='pagination-link'
        data-active={isActive}
        {...props}
      />
    </Button>
  );
}
function PaginationPrevious({ className, text = 'Previous', ...props }) {
  return (
    <PaginationLink
      aria-label='Go to previous page'
      size='default'
      className={cn('ds-part-pagination-previous', className)}
      {...props}
    >
      <RegistryIcon
        lucide='ChevronLeftIcon'
        data-icon='inline-start'
        className='ds-part-rtl-flip'
      />
      <span className='ds-part-pagination-previous-text hidden sm:block'>
        {text}
      </span>
    </PaginationLink>
  );
}
function PaginationNext({ className, text = 'Next', ...props }) {
  return (
    <PaginationLink
      aria-label='Go to next page'
      size='default'
      className={cn('ds-part-pagination-next', className)}
      {...props}
    >
      <span className='ds-part-pagination-next-text hidden sm:block'>
        {text}
      </span>
      <RegistryIcon
        lucide='ChevronRightIcon'
        data-icon='inline-end'
        className='ds-part-rtl-flip'
      />
    </PaginationLink>
  );
}
function PaginationEllipsis({ className, ...props }) {
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn(
        'ds-part-pagination-ellipsis flex items-center justify-center',
        className
      )}
      {...props}
    >
      <RegistryIcon lucide='MoreHorizontalIcon' />
      <span className='sr-only'>More pages</span>
    </span>
  );
}
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
};
