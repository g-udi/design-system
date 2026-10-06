
import {
  NativeSelect,
  NativeSelectOption
} from '@gaudi/design-system/core/Select';
import {
  PaginationRoot as Pagination,
  PaginationContentPrimitive as PaginationContent,
  PaginationEllipsisPrimitive as PaginationEllipsis,
  PaginationItemPrimitive as PaginationItem,
  PaginationLinkPrimitive as PaginationLink
} from '@gaudi/design-system/core/Pagination';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '@gaudi/design-system/core/NumberField';
const IconLink = ({ icon, label }) => (
  <PaginationLink href='#' size='icon' aria-label={label}>
    <RegistryIcon lucide={icon} className='ds-part-rtl-flip size-4' />
  </PaginationLink>
);
const pageNumbers = Array.from({ length: 10 }, (_, index) => index + 1);
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-md gap-3'>
      <Pagination aria-label='Numbered pages with page input'>
        <PaginationContent className='w-full justify-between gap-3'>
          <PaginationItem className='flex items-center gap-1'>
            <IconLink icon='ChevronLeftIcon' label='Go to previous page' />
            <PaginationLink href='#' isActive>1</PaginationLink>
            <PaginationLink href='#'>2</PaginationLink>
            <PaginationLink href='#'>3</PaginationLink>
            <PaginationEllipsis />
            <IconLink icon='ChevronRightIcon' label='Go to next page' />
          </PaginationItem>
          <PaginationItem className='flex items-center gap-2'>
            <span className='text-sm whitespace-nowrap text-text-muted'>Go to page</span>
            <NumberField min={1} max={10} defaultValue={1} className='h-8 w-14 text-center'>
              <NumberFieldGroup>
                <NumberFieldInput aria-label='Go to page' />
              </NumberFieldGroup>
            </NumberField>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Pagination aria-label='First, last and page select' className='justify-start'>
        <PaginationContent className='gap-1'>
          <PaginationItem><IconLink icon='ChevronFirstIcon' label='Go to first page' /></PaginationItem>
          <PaginationItem><IconLink icon='ChevronLeftIcon' label='Go to previous page' /></PaginationItem>
          <PaginationItem>
            <NativeSelect aria-label='Page' className='w-26' defaultValue='1'>
              {pageNumbers.map((page) => (
                <NativeSelectOption key={page} value={String(page)}>Page {page}</NativeSelectOption>
              ))}
            </NativeSelect>
          </PaginationItem>
          <PaginationItem><IconLink icon='ChevronRightIcon' label='Go to next page' /></PaginationItem>
          <PaginationItem><IconLink icon='ChevronLastIcon' label='Go to last page' /></PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
