// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href='#' size='icon' aria-label='Go to first page'>
            <RegistryIcon lucide='ChevronFirstIcon' className='size-4' />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' size='icon' aria-label='Go to previous page'>
            <RegistryIcon lucide='ChevronLeftIcon' className='size-4' />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <NativeSelect aria-label='Page' className='w-26' defaultValue='1'>
            <NativeSelectOption value='1'>Page 1</NativeSelectOption>
            <NativeSelectOption value='2'>Page 2</NativeSelectOption>
            <NativeSelectOption value='3'>Page 3</NativeSelectOption>
            <NativeSelectOption value='4'>Page 4</NativeSelectOption>
            <NativeSelectOption value='5'>Page 5</NativeSelectOption>
            <NativeSelectOption value='6'>Page 6</NativeSelectOption>
            <NativeSelectOption value='7'>Page 7</NativeSelectOption>
            <NativeSelectOption value='8'>Page 8</NativeSelectOption>
            <NativeSelectOption value='9'>Page 9</NativeSelectOption>
            <NativeSelectOption value='10'>Page 10</NativeSelectOption>
          </NativeSelect>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' size='icon' aria-label='Go to next page'>
            <RegistryIcon lucide='ChevronRightIcon' className='size-4' />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' size='icon' aria-label='Go to last page'>
            <RegistryIcon lucide='ChevronLastIcon' className='size-4' />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
