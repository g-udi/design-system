// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../../../../src/components/core/Pagination/parts/pagination.jsx';
export function Pattern() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href='#' className='rounded-full' />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' className='rounded-full'>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' isActive className={cn('rounded-full')}>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' className='rounded-full'>
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href='#' className='rounded-full' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
