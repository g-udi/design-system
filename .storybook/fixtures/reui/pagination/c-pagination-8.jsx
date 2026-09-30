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
    <Pagination className='w-full max-w-xs'>
      <PaginationContent className='w-full justify-between'>
        <PaginationItem>
          <PaginationLink href='#' size='icon' aria-label='Go to previous page'>
            <RegistryIcon lucide='ChevronLeftIcon' className='size-4' />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <span className='text-ui-muted-foreground text-xs'>
            Page <span className='text-ui-foreground font-medium'>1</span> of{' '}
            <span className='text-ui-foreground font-medium'>10</span>
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' size='icon' aria-label='Go to next page'>
            <RegistryIcon lucide='ChevronRightIcon' className='size-4' />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
