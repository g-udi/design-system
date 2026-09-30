import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from '../../../../src/components/core/Pagination/parts/pagination.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Pagination className='mx-auto max-w-lg'>
      <PaginationContent className='w-full justify-between'>
        <PaginationItem className='flex items-center gap-2'>
          <span className='text-text-muted text-sm whitespace-nowrap'>
            Rows per page
          </span>
          <NativeSelect
            aria-label='Rows per page'
            className='w-18'
            defaultValue='25'
          >
            <NativeSelectOption value='10'>10</NativeSelectOption>
            <NativeSelectOption value='25'>25</NativeSelectOption>
            <NativeSelectOption value='50'>50</NativeSelectOption>
            <NativeSelectOption value='100'>100</NativeSelectOption>
          </NativeSelect>
        </PaginationItem>
        <PaginationItem className='flex items-center gap-3'>
          <span className='text-text-muted text-sm whitespace-nowrap'>
            1-25 of 100
          </span>
          <div className='flex gap-1'>
            <PaginationLink href='#' size='icon' aria-label='Go to first page'>
              <RegistryIcon lucide='ChevronFirstIcon' className='size-4' />
            </PaginationLink>
            <PaginationLink
              href='#'
              size='icon'
              aria-label='Go to previous page'
            >
              <RegistryIcon lucide='ChevronLeftIcon' className='size-4' />
            </PaginationLink>
            <PaginationLink href='#' size='icon' aria-label='Go to next page'>
              <RegistryIcon lucide='ChevronRightIcon' className='size-4' />
            </PaginationLink>
            <PaginationLink href='#' size='icon' aria-label='Go to last page'>
              <RegistryIcon lucide='ChevronLastIcon' className='size-4' />
            </PaginationLink>
          </div>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
