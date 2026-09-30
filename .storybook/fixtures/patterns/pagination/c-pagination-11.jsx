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
    <Pagination>
      <PaginationContent className='rounded-md gap-0 overflow-hidden border'>
        <PaginationItem>
          <PaginationLink
            href='#'
            size='icon'
            aria-label='Go to previous page'
            className='border-ui-border rounded-none border-0 border-e'
          >
            <RegistryIcon lucide='ChevronLeftIcon' />
          </PaginationLink>
        </PaginationItem>

        {
          /* Page numbers */
          Array.from({ length: 4 }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href='#'
                isActive={index === 2}
                className='data-[active=true]:bg-ui-muted border-ui-border rounded-none border-0 border-e'
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))
        }

        <PaginationItem className='border-ui-border border-0 border-e'>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href='#'
            size='icon'
            aria-label='Go to next page'
            className='rounded-none border-0'
          >
            <RegistryIcon lucide='ChevronRightIcon' />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
