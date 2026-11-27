'use client';
import { useState } from 'react';

import {
  NativeSelect,
  NativeSelectOption
} from '@gaudi/design-system/core/Select';
import {
  getPageShortcuts,
  PaginationRoot as Pagination,
  PaginationContentPrimitive as PaginationContent,
  PaginationEllipsisPrimitive as PaginationEllipsis,
  PaginationItemPrimitive as PaginationItem,
  PaginationLinkPrimitive as PaginationLink,
  PaginationNextPrimitive as PaginationNext,
  PaginationPreviousPrimitive as PaginationPrevious
} from '@gaudi/design-system/core/Pagination';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '@gaudi/design-system/core/NumberField';
const IconLink = ({ icon, label, ...props }) => (
  <PaginationLink {...props} size='icon' aria-label={label}>
    <RegistryIcon lucide={icon} className='ds-part-rtl-flip size-4' />
  </PaginationLink>
);
const pageNumbers = Array.from({ length: 10 }, (_, index) => index + 1);
export function Pattern() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(1);
  const step = (current, destination, set) => ({ disabled: current === destination, onClick: () => set(destination) });
  return (
    <div className='mx-auto grid w-full max-w-md gap-3'>
      <Pagination aria-label='Numbered pages with page input'>
        <PaginationContent className='w-full justify-between gap-3'>
          <PaginationItem className='flex items-center gap-1'>
            <PaginationPrevious iconOnly {...step(page, Math.max(1, page - 1), setPage)} />
            {getPageShortcuts(page, 10).map(value => typeof value === 'number'
              ? <PaginationLink key={value} isActive={value === page} onClick={() => setPage(value)}>{value}</PaginationLink>
              : <PaginationEllipsis key={value} />)}
            <PaginationNext iconOnly {...step(page, Math.min(10, page + 1), setPage)} />
          </PaginationItem>
          <PaginationItem className='flex items-center gap-2'>
            <span className='text-sm whitespace-nowrap text-text-muted'>Go to page</span>
            <NumberField min={1} max={10} value={page} onValueChange={value => { if (Number.isInteger(value) && value >= 1 && value <= 10) setPage(value); }} className='h-8 w-14 text-center'>
              <NumberFieldGroup>
                <NumberFieldInput aria-label='Go to page' />
              </NumberFieldGroup>
            </NumberField>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Pagination aria-label='First, last and page select' className='justify-start'>
        <PaginationContent className='gap-1'>
          <PaginationItem><IconLink icon='ChevronFirstIcon' label='Go to first page' {...step(selected, 1, setSelected)} /></PaginationItem>
          <PaginationItem><PaginationPrevious iconOnly {...step(selected, Math.max(1, selected - 1), setSelected)} /></PaginationItem>
          <PaginationItem>
            <NativeSelect aria-label='Page' className='w-26' value={String(selected)} onChange={event => setSelected(Number(event.target.value))}>
              {pageNumbers.map((page) => (
                <NativeSelectOption key={page} value={String(page)}>Page {page}</NativeSelectOption>
              ))}
            </NativeSelect>
          </PaginationItem>
          <PaginationItem><PaginationNext iconOnly {...step(selected, Math.min(10, selected + 1), setSelected)} /></PaginationItem>
          <PaginationItem><IconLink icon='ChevronLastIcon' label='Go to last page' {...step(selected, 10, setSelected)} /></PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
