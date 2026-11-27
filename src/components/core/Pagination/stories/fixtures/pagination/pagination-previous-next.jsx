'use client';
import { useState } from 'react';
import {
  PaginationRoot as Pagination,
  PaginationContentPrimitive as PaginationContent,
  PaginationItemPrimitive as PaginationItem,
  PaginationNextPrimitive as PaginationNext,
  PaginationPreviousPrimitive as PaginationPrevious
} from '@gaudi/design-system/core/Pagination';
const PageInfo = ({ page }) => (
  <span className='text-xs text-text-muted'>
    Page <span className='font-medium text-text'>{page}</span> of <span className='font-medium text-text'>10</span>
  </span>
);
function Pager({ name }) {
  const [page, setPage] = useState(1);
  const previous = { disabled: page === 1, onClick: () => setPage(page - 1) };
  const next = { disabled: page === 10, onClick: () => setPage(page + 1) };
  const rows = {
  'Info centred': [
    <PaginationPrevious {...previous} key='p' iconOnly />,
    <PageInfo key='i' page={page} />,
    <PaginationNext {...next} key='n' iconOnly />
  ],
  'Info leading': [
    <PageInfo key='i' page={page} />,
    <span key='b' className='flex gap-1'>
      <PaginationPrevious {...previous} />
      <PaginationNext {...next} />
    </span>
  ],
  'Arrows only': [
    <PaginationPrevious {...previous} key='p' iconOnly aria-label='Previous' />,
    <PaginationNext {...next} key='n' iconOnly aria-label='Next' />
  ]
};
  return <Pagination aria-label={`${name} pagination`}><PaginationContent className='w-full justify-between'>
    {rows[name].map(item => <PaginationItem key={item.key}>{item}</PaginationItem>)}
  </PaginationContent><span className='sr-only' role='status'>Page {page} of 10</span></Pagination>;
}
export function Pattern() {
  return <div className='mx-auto grid w-full max-w-sm grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3'>
    {['Info centred','Info leading','Arrows only'].map(name => <div key={name} className='contents'>
      <span className='text-xs text-text-muted'>{name}</span><Pager name={name} />
    </div>)}
  </div>;
}
