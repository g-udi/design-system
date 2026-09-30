// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
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
    <Card className='p-2'>
      <CardContent className='p-0'>
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationLink
                href='#'
                size='icon'
                aria-label='Go to previous page'
                className='hover:bg-ui-muted h-8 w-8 rounded-control'
              >
                <RegistryIcon lucide='ChevronLeftIcon' className='size-4' />
              </PaginationLink>
            </PaginationItem>

            {[1, 2, 3].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href='#'
                  isActive={page === 1}
                  className={
                    page === 1
                      ? 'bg-ui-primary text-ui-primary-foreground hover:bg-ui-primary/90'
                      : 'hover:bg-ui-muted'
                  }
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            {[10, 11, 12].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href='#'>{page}</PaginationLink>
              </PaginationItem>
            ))}

            {/* Next */}
            <PaginationItem>
              <PaginationLink
                href='#'
                size='icon'
                aria-label='Go to next page'
                className='hover:bg-ui-muted h-8 w-8 rounded-control'
              >
                <RegistryIcon lucide='ChevronRightIcon' className='size-4' />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}
