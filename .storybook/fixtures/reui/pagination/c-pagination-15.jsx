// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../../../../src/components/core/Pagination/parts/pagination.jsx';
export function Pattern() {
  return (
    <Pagination>
      <PaginationContent className='w-full justify-between'>
        <PaginationItem>
          <span className='text-ui-muted-foreground text-sm'>
            Page <span className='text-ui-foreground font-medium'>1</span> of{' '}
            <span className='text-ui-foreground font-medium'>10</span>
          </span>
        </PaginationItem>
        <PaginationItem className='flex flex-wrap items-center gap-1'>
          <PaginationPrevious href='#' />
          <PaginationLink href='#' isActive>
            1
          </PaginationLink>
          <PaginationLink href='#'>2</PaginationLink>
          <PaginationLink href='#'>3</PaginationLink>
          <PaginationLink href='#'>4</PaginationLink>
          <PaginationEllipsis />
          <PaginationNext href='#' />
        </PaginationItem>
        <PaginationItem>
          <NativeSelect aria-label='Rows per page' className='w-28'>
            <NativeSelectOption value='10'>10 / page</NativeSelectOption>
            <NativeSelectOption value='20'>20 / page</NativeSelectOption>
            <NativeSelectOption value='50'>50 / page</NativeSelectOption>
            <NativeSelectOption value='100'>100 / page</NativeSelectOption>
          </NativeSelect>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
