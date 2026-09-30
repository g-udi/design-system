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
          <PaginationLink href='#' size='default' className='gap-2'>
            <RegistryIcon lucide='ArrowLeftIcon' className='size-4' />
            Previous
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' size='default' className='gap-2'>
            Next
            <RegistryIcon lucide='ArrowRightIcon' className='size-4' />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
