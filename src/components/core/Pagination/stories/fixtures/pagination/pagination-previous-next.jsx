'use client';
import { useState } from 'react';
import {
  PaginationRoot as Pagination,
  PaginationContentPrimitive as PaginationContent,
  PaginationItemPrimitive as PaginationItem,
  PaginationLinkPrimitive as PaginationLink,
  PaginationNextPrimitive as PaginationNext,
  PaginationPreviousPrimitive as PaginationPrevious
} from '@gaudi/design-system/core/Pagination';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const PageInfo = ({ page }) => (
  <span className='text-xs text-text-muted'>
    Page <span className='font-medium text-text'>{page}</span> of <span className='font-medium text-text'>10</span>
  </span>
);
const IconLink = ({ icon, label, ...props }) => (
  <PaginationLink {...props} size='icon' aria-label={label}>
    <RegistryIcon lucide={icon} className='ds-part-rtl-flip size-4' />
  </PaginationLink>
);
const TextLink = ({ icon, children, trailing, ...props }) => (
  <PaginationLink {...props} size='default' className='gap-2'>
    {trailing ? null : <RegistryIcon lucide={icon} className='ds-part-rtl-flip size-4' />}
    {children}
    {trailing ? <RegistryIcon lucide={icon} className='ds-part-rtl-flip size-4' /> : null}
  </PaginationLink>
);
function Pager({ name }) {
  const [page, setPage] = useState(1);
  const previous = { disabled: page === 1, onClick: () => setPage(page - 1) };
  const next = { disabled: page === 10, onClick: () => setPage(page + 1) };
  const rows = {
  'Info centred': [
    <IconLink {...previous} key='p' icon='ChevronLeftIcon' label='Go to previous page' />,
    <PageInfo key='i' page={page} />,
    <IconLink {...next} key='n' icon='ChevronRightIcon' label='Go to next page' />
  ],
  'Info leading': [
    <PageInfo key='i' page={page} />,
    <span key='b' className='flex gap-1'>
      <PaginationPrevious {...previous} />
      <PaginationNext {...next} />
    </span>
  ],
  'Arrows only': [
    <TextLink {...previous} key='p' icon='ArrowLeftIcon'>Previous</TextLink>,
    <TextLink {...next} key='n' icon='ArrowRightIcon' trailing>Next</TextLink>
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
