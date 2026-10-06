import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../Button/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

function Pagination({ className, ...props }) {
  return (
    <nav
      aria-label='pagination'
      data-slot='pagination'
      className={cn('ds-part-pagination mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }) {
  return (
    <ul
      data-slot='pagination-content'
      className={cn('ds-part-pagination-content m-0 flex max-w-full list-none flex-wrap items-center gap-y-2 p-0', className)}
      {...props}
    />
  );
}

function PaginationItem(props) {
  return <li data-slot='pagination-item' {...props} />;
}

// One page control: a router-aware link with `href`, a button with `onClick`, a disabled button with `disabled`.
function PaginationLink({ className, disabled = false, href, isActive, onClick, size = 'icon', variant, ...props }) {
  return (
    <Button
      variant={variant ?? (isActive ? 'outline' : 'ghost')}
      size={size}
      href={disabled || onClick ? undefined : href}
      onClick={onClick}
      disabled={disabled}
      aria-current={isActive ? 'page' : undefined}
      data-slot='pagination-link'
      data-active={isActive}
      className={cn('ds-part-pagination-link', className)}
      {...props}
    />
  );
}

function PaginationPrevious({ className, text = 'Previous', ...props }) {
  return (
    <PaginationLink
      aria-label='Go to previous page'
      size='default'
      className={cn('ds-part-pagination-previous group/pagination-arrow', className)}
      {...props}
    >
      <RegistryIcon lucide='ChevronLeftIcon' className='transition-transform group-hover/pagination-arrow:-translate-x-0.5 motion-reduce:transition-none rtl:-scale-x-100' />
      <span className='hidden sm:block'>{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, text = 'Next', ...props }) {
  return (
    <PaginationLink
      aria-label='Go to next page'
      size='default'
      className={cn('ds-part-pagination-next group/pagination-arrow', className)}
      {...props}
    >
      <span className='hidden sm:block'>{text}</span>
      <RegistryIcon lucide='ChevronRightIcon' className='transition-transform group-hover/pagination-arrow:translate-x-0.5 motion-reduce:transition-none rtl:-scale-x-100' />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }) {
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn('ds-part-pagination-ellipsis flex items-center justify-center text-text-muted', className)}
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
