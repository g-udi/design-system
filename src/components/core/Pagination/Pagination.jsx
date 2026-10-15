'use client';

import { useState } from 'react';
import Button from '../Button';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/PopoverPrimitives.jsx';
import { cn } from '../../../utilities/cn';
import {
  Pagination as PaginationPart,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext as PaginationNextPart,
  PaginationPrevious as PaginationPreviousPart
} from './PaginationPrimitives.jsx';

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

// A labelled status button opens shortcuts through the shared keyboard-accessible popover.
export const PaginationStatus = ({ className, size = 'md', currentPage = 1, getHref = (page) => `?page=${page}`, onPageChange, totalPages = 1, ofLabel = 'of', shortcutsLabel = 'Page shortcuts' }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' tone='neutral' size={size} className={cn('text-text-muted', className)} aria-label={`${shortcutsLabel}: ${currentPage} ${ofLabel} ${totalPages}`}>
          <span className='font-semibold text-accent'>{currentPage}</span>
          <span>{ofLabel}</span>
          <span>{totalPages}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label={shortcutsLabel} side='top' collisionPadding={12} className='w-auto p-1.5'>
        <PaginationContent aria-label={shortcutsLabel} className='justify-center gap-1'>
          {getPageShortcuts(currentPage, totalPages).map((shortcut) => (
            <PaginationItem key={shortcut}>
              {typeof shortcut === 'string' ? <PaginationEllipsis className='size-8' /> : (
                <PaginationLink
                  href={getHref(shortcut)}
                  isActive={shortcut === currentPage}
                  onClick={onPageChange ? () => {
                    onPageChange(shortcut);
                    setOpen(false);
                  } : undefined}
                >
                  {shortcut}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </PaginationContent>
      </PopoverContent>
    </Popover>
  );
};

/*
 * Server components cannot pass functions to this client module, so page links can also be plain
 * strings: `hrefTemplate` with a `{page}` placeholder, and `firstPageHref` for page 1.
 */
const templateHref = (hrefTemplate, firstPageHref) => (page) => (page === 1 && firstPageHref ? firstPageHref : hrefTemplate.replace('{page}', String(page)));

// Previous, the "n of total" status and Next under a list: the blog's archive pager.
export const PaginationBar = ({ currentPage = 1, firstPageHref, getHref: getHrefProp, hrefTemplate, label = 'Pagination', onPageChange, totalPages = 1, previousLabel = 'Previous', nextLabel = 'Next', ofLabel = 'of', shortcutsLabel = 'Page shortcuts' }) => {
  const getHref = getHrefProp ?? (hrefTemplate ? templateHref(hrefTemplate, firstPageHref) : (page) => `?page=${page}`);
  const pageAction = (page) => ({
    href: getHref(page),
    onClick: onPageChange ? () => onPageChange(page) : undefined
  });

  return (
    <Pagination label={ label } className='border-t border-border pt-6'>
      <div className='grid w-full grid-cols-[1fr_auto_1fr] items-center gap-1'>
        <div className='flex justify-start'>
          <PaginationPrevious label={ previousLabel } disabled={ currentPage <= 1 } { ...pageAction(Math.max(1, currentPage - 1)) } />
        </div>
        <PaginationStatus currentPage={ currentPage } getHref={ getHref } onPageChange={ onPageChange } totalPages={ totalPages } ofLabel={ ofLabel } shortcutsLabel={ shortcutsLabel } />
        <div className='flex justify-end'>
          <PaginationNext label={ nextLabel } disabled={ currentPage >= totalPages } { ...pageAction(Math.min(totalPages, currentPage + 1)) } />
        </div>
      </div>
    </Pagination>
  );
};

export default PaginationBar;
