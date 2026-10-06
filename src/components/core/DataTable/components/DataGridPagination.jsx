'use client';
import { useDataGrid } from '../DataGrid.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../Select/SelectPrimitives.jsx';
import { Skeleton } from '../../Skeleton/SkeletonPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { PaginationStatus } from '../../Pagination/index.js';
function getDataGridPaginationItems(pageIndex, pageCount, limit) {
  const sibling = Math.max(0, Math.floor(((Math.floor(limit) || 3) - 3) / 2));
  const pages = sibling * 2 + 3;
  if (pageCount <= pages + 2) {
    return Array.from({ length: pageCount }, (_, index) => ({
      type: 'page',
      index
    }));
  }
  if (pageIndex <= sibling + 2) {
    return [
      ...Array.from({ length: pages }, (_, index) => ({
        type: 'page',
        index
      })),
      { type: 'ellipsis', direction: 'next', target: pages },
      { type: 'page', index: pageCount - 1 }
    ];
  }
  if (pageIndex >= pageCount - sibling - 3) {
    return [
      { type: 'page', index: 0 },
      {
        type: 'ellipsis',
        direction: 'previous',
        target: pageCount - pages - 1
      },
      ...Array.from({ length: pages }, (_, offset) => ({
        type: 'page',
        index: pageCount - pages + offset
      }))
    ];
  }
  return [
    { type: 'page', index: 0 },
    {
      type: 'ellipsis',
      direction: 'previous',
      target: pageIndex - sibling - 1
    },
    ...Array.from({ length: sibling * 2 + 1 }, (_, offset) => ({
      type: 'page',
      index: pageIndex - sibling + offset
    })),
    { type: 'ellipsis', direction: 'next', target: pageIndex + sibling + 1 },
    { type: 'page', index: pageCount - 1 }
  ];
}
const PAGE_BUTTON_WIDTH_CLASS = 'min-w-7';
function DataGridPagination(props) {
  const { i18n, table, recordCount, isLoading } = useDataGrid();
  const defaultProps = {
    sizes: [5, 10, 25, 50, 100],
    sizesSkeleton: <Skeleton className='h-8 w-44' />,
    moreLimit: 5,
    infoSkeleton: <Skeleton className='h-8 w-60' />,
    rowsPerPageLabel: i18n.labels.rowsPerPage,
    previousPageLabel: i18n.labels.previousPage,
    nextPageLabel: i18n.labels.nextPage,
    ellipsisText: i18n.labels.paginationEllipsis
  };
  const mergedProps = { ...defaultProps, ...props };
  const btnBaseClasses = 'p-0 text-sm';
  const btnArrowClasses = btnBaseClasses + ' rtl:transform rtl:rotate-180';
  const pageIndex = table.state.pagination.pageIndex;
  const pageSize = table.state.pagination.pageSize;
  const from = recordCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, recordCount);
  const pageCount = table.getPageCount();
  const paginationInfo = mergedProps.info
    ? mergedProps.info
        .replaceAll('{from}', from.toString())
        .replaceAll('{to}', to.toString())
        .replaceAll('{count}', recordCount.toString())
    : i18n.labels.paginationInfo({ from, to, count: recordCount });
  const paginationItems = getDataGridPaginationItems(
    pageIndex,
    pageCount,
    mergedProps.moreLimit ?? 5
  );
  return (
    <div
      data-slot='data-grid-pagination'
      className={cn(
        '@container/grid-pagination flex grow flex-col flex-wrap items-center justify-between gap-2.5 py-2.5 sm:flex-row sm:py-0',
        mergedProps.className
      )}
    >
      <div className='order-2 flex flex-wrap items-center gap-2.5 pb-2.5 sm:order-1 sm:pb-0'>
        {isLoading ? (
          mergedProps.sizesSkeleton
        ) : (
          <>
            <div className='text-ui-muted-foreground text-sm'>
              {mergedProps.rowsPerPageLabel}
            </div>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                const newPageSize = Number(value);
                table.setPageSize(newPageSize);
              }}
            >
              {/* Keep three-digit page sizes readable. */}
              <SelectTrigger
                aria-label={mergedProps.rowsPerPageLabel}
                className='w-fit min-w-16'
                size='sm'
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position='popper'
                align='start'
                className='min-w-(--radix-select-trigger-width)'
              >
                {mergedProps.sizes?.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      <div className='order-1 flex flex-col items-center justify-center gap-2.5 pt-2.5 sm:order-2 sm:flex-row sm:justify-end sm:pt-0'>
        {isLoading ? (
          mergedProps.infoSkeleton
        ) : (
          <>
            <div className='text-ui-muted-foreground order-2 text-sm text-nowrap sm:order-1'>
              {paginationInfo}
            </div>
            {pageCount > 1 && (
              <div className='order-1 flex items-center justify-center gap-1'>
                <Button
                  size='icon-sm'
                  variant='ghost'
                  className={btnArrowClasses}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className='sr-only'>
                    {mergedProps.previousPageLabel}
                  </span>
                  <RegistryIcon lucide='ChevronLeftIcon' className='size-4' />
                </Button>

                <PaginationStatus
                  size='sm'
                  currentPage={pageIndex + 1}
                  totalPages={pageCount}
                  onPageChange={(page) => table.setPageIndex(page - 1)}
                  ofLabel={i18n.labels.pageOf}
                  shortcutsLabel={i18n.labels.pageShortcuts}
                  className='@min-[32rem]/grid-pagination:hidden'
                />
                <div className='hidden items-center gap-1 @min-[32rem]/grid-pagination:flex'>
                  {paginationItems.map((item) =>
                    item.type === 'page' ? (
                      <Button
                        key={`page-${item.index}`}
                        size='sm'
                        variant='ghost'
                        aria-label={i18n.labels.goToPage(item.index + 1)}
                        aria-current={pageIndex === item.index ? 'page' : void 0}
                        className={cn(
                          PAGE_BUTTON_WIDTH_CLASS,
                          'px-1.5 text-sm',
                          'text-ui-muted-foreground',
                          {
                            'bg-ui-accent text-ui-accent-foreground':
                              pageIndex === item.index
                          }
                        )}
                        onClick={() => {
                          if (pageIndex !== item.index) {
                            table.setPageIndex(item.index);
                          }
                        }}
                      >
                        {item.index + 1}
                      </Button>
                    ) : (
                      /* Clickable, unlike the Pagination part's ellipsis, which is
           an aria-hidden span. This one MOVES the user, so it needs
           a name saying where. */
                      <Button
                        key={`ellipsis-${item.direction}`}
                        size='icon-sm'
                        className={btnBaseClasses}
                        variant='ghost'
                        aria-label={i18n.labels.goToPage(item.target + 1)}
                        onClick={() => table.setPageIndex(item.target)}
                      >
                        {mergedProps.ellipsisText}
                      </Button>
                    )
                  )}
                </div>

                <Button
                  size='icon-sm'
                  variant='ghost'
                  className={btnArrowClasses}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className='sr-only'>{mergedProps.nextPageLabel}</span>
                  <RegistryIcon lucide='ChevronRightIcon' className='size-4' />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
export { DataGridPagination };
