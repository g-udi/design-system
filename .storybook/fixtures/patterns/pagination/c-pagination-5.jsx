import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from '../../../../src/components/core/Pagination/parts/pagination.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Pagination className='w-full max-w-xs'>
      <PaginationContent className='justify-between gap-4'>
        <PaginationItem className='flex items-center gap-1'>
          <PaginationLink href='#' size='icon' aria-label='Go to previous page'>
            <RegistryIcon lucide='ChevronLeftIcon' className='size-4' />
          </PaginationLink>
          <PaginationLink href='#' isActive>
            1
          </PaginationLink>
          <PaginationLink href='#'>2</PaginationLink>
          <PaginationLink href='#'>3</PaginationLink>
          <PaginationEllipsis />
          <PaginationLink href='#' size='icon' aria-label='Go to next page'>
            <RegistryIcon lucide='ChevronRightIcon' className='size-4' />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem className='flex items-center gap-2'>
          <span className='text-ui-muted-foreground text-sm whitespace-nowrap'>
            Go to page
          </span>
          <Input
            aria-label='Go to page'
            type='number'
            min={1}
            max={10}
            defaultValue={1}
            className='h-9 w-14 text-center'
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
