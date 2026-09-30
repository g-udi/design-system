// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from '../../../../src/components/core/Pagination/parts/pagination.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href='#' aria-label='Go to previous page' size='icon'>
            <RegistryIcon lucide='ChevronLeftIcon' className='size-4' />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#'>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#'>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' aria-label='Go to next page' size='icon'>
            <RegistryIcon lucide='ChevronRightIcon' className='size-4' />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
