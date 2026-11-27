'use client';
import { useState } from 'react';
import {
  NativeSelect,
  NativeSelectOption
} from '@gaudi/design-system/core/Select';
import {
  PaginationRoot as Pagination,
  PaginationContentPrimitive as PaginationContent,
  PaginationItemPrimitive as PaginationItem,
  PaginationLinkPrimitive as PaginationLink
} from '@gaudi/design-system/core/Pagination';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [size, setSize] = useState(25);
  const [page, setPage] = useState(1);
  const total = Math.ceil(100 / size);
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
            value={String(size)}
            onChange={event => { setSize(Number(event.target.value)); setPage(1); }}
          >
            <NativeSelectOption value='10'>10</NativeSelectOption>
            <NativeSelectOption value='25'>25</NativeSelectOption>
            <NativeSelectOption value='50'>50</NativeSelectOption>
            <NativeSelectOption value='100'>100</NativeSelectOption>
          </NativeSelect>
        </PaginationItem>
        <PaginationItem className='flex items-center gap-3'>
          <span className='text-text-muted text-sm whitespace-nowrap'>
            {(page - 1) * size + 1}–{Math.min(page * size, 100)} of 100
          </span>
          <div className='flex gap-1'>
            <PaginationLink disabled={page === 1} onClick={() => setPage(1) } size='icon' aria-label='Go to first page'>
              <RegistryIcon lucide='ChevronFirstIcon' className='size-4' />
            </PaginationLink>
            <PaginationLink
              disabled={page === 1} onClick={() => setPage(page - 1) }
              size='icon'
              aria-label='Go to previous page'
            >
              <RegistryIcon lucide='ChevronLeftIcon' className='size-4' />
            </PaginationLink>
            <PaginationLink disabled={page === total} onClick={() => setPage(page + 1) } size='icon' aria-label='Go to next page'>
              <RegistryIcon lucide='ChevronRightIcon' className='size-4' />
            </PaginationLink>
            <PaginationLink disabled={page === total} onClick={() => setPage(total) } size='icon' aria-label='Go to last page'>
              <RegistryIcon lucide='ChevronLastIcon' className='size-4' />
            </PaginationLink>
          </div>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
