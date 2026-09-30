import Icon from '../Icon';
import Link from '../Link';
import { cn } from '../../../utilities/cn';

export const POSTS_PER_PAGE = 7;

export const Pagination = ({ children, className, label = 'Pagination' }) => <nav aria-label={ label } className={ cn('mx-auto flex w-full justify-center', className) }>{children}</nav>;
export const PaginationContent = ({ children, className }) => <div role='list' className={ cn('m-0 flex flex-row flex-wrap items-center gap-1 p-0', className) }>{children}</div>;
export const PaginationItem = ({ children, className }) => <div role='listitem' className={ cn('m-0 p-0', className) }>{children}</div>;

const actionClassName = 'group inline-flex min-h-11 items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-blue-300 hover:bg-gray-50 hover:text-blue-600 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400 dark:focus-visible:ring-offset-gray-950';
const disabledActionClassName = 'inline-flex min-h-11 cursor-not-allowed items-center rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm font-medium text-gray-400 dark:border-border-dark dark:bg-gray-800 dark:text-gray-600';

export const PaginationLink = ({ children, className, disabled = false, href, isActive, onClick }) => {
  const classes = cn(
    'inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-sm font-medium',
    'text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 hover:no-underline',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 motion-reduce:transition-none',
    'dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-blue-400 dark:focus-visible:ring-offset-gray-950',
    isActive && 'bg-blue-600 text-white hover:bg-blue-600 hover:text-white dark:text-white dark:hover:text-white',
    disabled && 'pointer-events-none cursor-not-allowed opacity-45',
    className
  );

  if (disabled)
    return (
      <span aria-disabled='true' className={ classes }>
        {children}
      </span>
    );

  if (onClick)
    return (
      <button type='button' onClick={ onClick } aria-current={ isActive ? 'page' : undefined } className={ classes }>
        {children}
      </button>
    );

  return (
    <Link
      href={ href }
      aria-current={ isActive ? 'page' : undefined }
      className={ classes }
    >
      {children}
    </Link>
  );
};

export const PaginationPrevious = ({ className, disabled = false, href = '#', label = 'Previous', onClick, ...props }) => {
  const classes = cn(disabled ? disabledActionClassName : actionClassName, className);

  if (disabled)
    return <button type='button' disabled className={ classes } { ...props }><Icon name='ArrowLeft' decorative size='xs' className='mr-2' />{label}</button>;

  if (onClick)
    return <button type='button' onClick={ onClick } className={ classes } { ...props }><Icon name='ArrowLeft' decorative size='xs' className='mr-2 transition-transform duration-200 group-hover:-translate-x-1' />{label}</button>;

  return <Link href={ href } variant='bare' className={ classes } { ...props }><Icon name='ArrowLeft' decorative size='xs' className='mr-2 transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0' />{label}</Link>;
};

export const PaginationNext = ({ className, disabled = false, href = '#', label = 'Next', onClick, ...props }) => {
  const classes = cn(disabled ? disabledActionClassName : actionClassName, className);

  if (disabled)
    return <button type='button' disabled className={ classes } { ...props }>{label}<Icon name='ArrowRight' decorative size='xs' className='ml-2' /></button>;

  if (onClick)
    return <button type='button' onClick={ onClick } className={ classes } { ...props }>{label}<Icon name='ArrowRight' decorative size='xs' className='ml-2 transition-transform duration-200 group-hover:translate-x-1' /></button>;

  return <Link href={ href } variant='bare' className={ classes } { ...props }>{label}<Icon name='ArrowRight' decorative size='xs' className='ml-2 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0' /></Link>;
};

export const PaginationEllipsis = ({ className }) => <span className={ cn('inline-flex size-11 items-center justify-center text-sm text-gray-500', className) }>...</span>;

const getPageShortcuts = (currentPage, totalPages) => {
  if (totalPages <= 5) return Array.from({ 'length': totalPages }, (_, index) => index + 1);

  const pages = [ 1, currentPage - 1, currentPage, currentPage + 1, totalPages ]
    .filter((page) => page >= 1 && page <= totalPages)
    .filter((page, index, values) => values.indexOf(page) === index)
    .sort((first, second) => first - second);

  return pages.flatMap((page, index) => {
    const previousPage = pages[index - 1];

    if (previousPage && page - previousPage > 1) return [ `ellipsis-${previousPage}-${page}`, page ];

    return [ page ];
  });
};

export const PaginationStatus = ({ className, currentPage = 1, getHref = (page) => `?page=${page}`, onPageChange, totalPages = 1 }) => (
  <span className={ cn('group/pagination-status relative inline-flex justify-center', className) }>
    <span className='rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 shadow-sm outline-none transition-colors dark:border-border-dark dark:bg-gray-900 dark:text-gray-400'>
      <span className='font-semibold text-blue-600 dark:text-blue-400'>{currentPage}</span>
      <span className='mx-1.5 text-gray-600 dark:text-gray-300'>of</span>
      <span className='text-gray-600 dark:text-gray-300'>{totalPages}</span>
    </span>
    <span
      role='list'
      aria-label='Page shortcuts'
      className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 flex -translate-x-1/2 translate-y-0.5 flex-row flex-wrap items-center justify-center gap-1 w-max max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 bg-white p-2 opacity-0 shadow-xl shadow-gray-950/10 ring-1 ring-gray-950/5 transition duration-150 before:absolute before:left-0 before:top-full before:h-3 before:w-full before:content-[''] group-hover/pagination-status:pointer-events-auto group-hover/pagination-status:translate-y-0 group-hover/pagination-status:opacity-100 group-focus-within/pagination-status:pointer-events-auto group-focus-within/pagination-status:translate-y-0 group-focus-within/pagination-status:opacity-100 dark:border-gray-800 dark:bg-gray-950 dark:ring-white/10"
    >
      {getPageShortcuts(currentPage, totalPages).map((shortcut) => {
        if (typeof shortcut === 'string') return (
          <span key={ shortcut } role='listitem'>
            <PaginationEllipsis />
          </span>
        );

        return (
          <span key={ shortcut } role='listitem'>
            <PaginationLink
              href={ getHref(shortcut) }
              isActive={ shortcut === currentPage }
              onClick={ onPageChange ? () => onPageChange(shortcut) : undefined }
            >
              {shortcut}
            </PaginationLink>
          </span>
        );
      })}
    </span>
  </span>
);

export const PaginationBar = ({ currentPage = 1, getHref = (page) => `?page=${page}`, label = 'Pagination', onPageChange, totalPages = 1 }) => (
  <Pagination label={ label } className='border-t border-gray-200 pt-6 dark:border-gray-800'>
    <div className='grid w-full grid-cols-[1fr_auto_1fr] items-center gap-1'>
      <div className='flex justify-start'>
        <PaginationPrevious disabled={ currentPage <= 1 } href={ getHref(Math.max(1, currentPage - 1)) } onClick={ onPageChange ? () => onPageChange(currentPage - 1) : undefined } />
      </div>
      <PaginationStatus currentPage={ currentPage } getHref={ getHref } onPageChange={ onPageChange } totalPages={ totalPages } />
      <div className='flex justify-end'>
        <PaginationNext disabled={ currentPage >= totalPages } href={ getHref(Math.min(totalPages, currentPage + 1)) } onClick={ onPageChange ? () => onPageChange(currentPage + 1) : undefined } />
      </div>
    </div>
  </Pagination>
);

export default PaginationBar;
