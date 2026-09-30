import { cn } from '../../../utilities/cn';
import {
  Pagination as PaginationPart,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext as PaginationNextPart,
  PaginationPrevious as PaginationPreviousPart
} from './parts/pagination.jsx';

export const POSTS_PER_PAGE = 7;

// The convenience API is the composition parts with a labelled landmark and bordered Previous / Next actions.
export const Pagination = ({ label = 'Pagination', ...props }) => <PaginationPart aria-label={ label } { ...props } />;

export const PaginationPrevious = ({ href = '#', label = 'Previous', ...props }) => (
  <PaginationPreviousPart href={ href } text={ label } aria-label={ label } variant='outline' tone='neutral' { ...props } />
);

export const PaginationNext = ({ href = '#', label = 'Next', ...props }) => (
  <PaginationNextPart href={ href } text={ label } aria-label={ label } variant='outline' tone='neutral' { ...props } />
);

export { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink };

const getPageShortcuts = (currentPage, totalPages) => {
  if (totalPages <= 5) return Array.from({ 'length': totalPages }, (_, index) => index + 1);

  const pages = [ 1, currentPage - 1, currentPage, currentPage + 1, totalPages ]
    .filter((page, index, values) => page >= 1 && page <= totalPages && values.indexOf(page) === index)
    .sort((first, second) => first - second);

  return pages.flatMap((page, index) => {
    const previousPage = pages[index - 1];

    return previousPage && page - previousPage > 1 ? [ `ellipsis-${previousPage}-${page}`, page ] : [ page ];
  });
};

// "3 of 8" that reveals a row of page shortcuts on hover or keyboard focus.
export const PaginationStatus = ({ className, currentPage = 1, getHref = (page) => `?page=${page}`, onPageChange, totalPages = 1 }) => (
  <span className={ cn('group/pagination-status relative inline-flex justify-center', className) }>
    <span className='rounded-control border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-muted'>
      <span className='font-semibold text-accent'>{currentPage}</span>
      <span className='mx-1.5'>of</span>
      <span>{totalPages}</span>
    </span>
    <PaginationContent
      aria-label='Page shortcuts'
      className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 translate-y-0.5 justify-center gap-1 rounded-card border border-border bg-surface p-1.5 opacity-0 shadow-lg transition duration-150 before:absolute before:left-0 before:top-full before:h-3 before:w-full before:content-[''] group-focus-within/pagination-status:pointer-events-auto group-focus-within/pagination-status:translate-y-0 group-focus-within/pagination-status:opacity-100 group-hover/pagination-status:pointer-events-auto group-hover/pagination-status:translate-y-0 group-hover/pagination-status:opacity-100 motion-reduce:transition-none"
    >
      {getPageShortcuts(currentPage, totalPages).map((shortcut) => (
        <PaginationItem key={ shortcut }>
          {typeof shortcut === 'string' ? <PaginationEllipsis className='size-8' /> : (
            <PaginationLink
              href={ getHref(shortcut) }
              isActive={ shortcut === currentPage }
              onClick={ onPageChange ? () => onPageChange(shortcut) : undefined }
            >
              {shortcut}
            </PaginationLink>
          )}
        </PaginationItem>
      ))}
    </PaginationContent>
  </span>
);

// Previous, the "n of total" status and Next under a list: the blog's archive pager.
export const PaginationBar = ({ currentPage = 1, getHref = (page) => `?page=${page}`, label = 'Pagination', onPageChange, totalPages = 1 }) => {
  const pageAction = (page) => ({
    href: getHref(page),
    onClick: onPageChange ? () => onPageChange(page) : undefined
  });

  return (
    <Pagination label={ label } className='border-t border-border pt-6'>
      <div className='grid w-full grid-cols-[1fr_auto_1fr] items-center gap-1'>
        <div className='flex justify-start'>
          <PaginationPrevious disabled={ currentPage <= 1 } { ...pageAction(Math.max(1, currentPage - 1)) } />
        </div>
        <PaginationStatus currentPage={ currentPage } getHref={ getHref } onPageChange={ onPageChange } totalPages={ totalPages } />
        <div className='flex justify-end'>
          <PaginationNext disabled={ currentPage >= totalPages } { ...pageAction(Math.min(totalPages, currentPage + 1)) } />
        </div>
      </div>
    </Pagination>
  );
};

export default PaginationBar;
