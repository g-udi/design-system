import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../../../../src/components/core/Pagination/parts/pagination.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const PageInfo = () => (
  <span className='text-xs text-text-muted'>
    Page <span className='font-medium text-text'>1</span> of <span className='font-medium text-text'>10</span>
  </span>
);
const IconLink = ({ icon, label }) => (
  <PaginationLink href='#' size='icon' aria-label={label}>
    <RegistryIcon lucide={icon} className='ds-part-rtl-flip size-4' />
  </PaginationLink>
);
const TextLink = ({ icon, children, trailing }) => (
  <PaginationLink href='#' size='default' className='gap-2'>
    {trailing ? null : <RegistryIcon lucide={icon} className='ds-part-rtl-flip size-4' />}
    {children}
    {trailing ? <RegistryIcon lucide={icon} className='ds-part-rtl-flip size-4' /> : null}
  </PaginationLink>
);
const rows = {
  'Info centred': [
    <IconLink key='p' icon='ChevronLeftIcon' label='Go to previous page' />,
    <PageInfo key='i' />,
    <IconLink key='n' icon='ChevronRightIcon' label='Go to next page' />
  ],
  'Info leading': [
    <PageInfo key='i' />,
    <span key='b' className='flex gap-1'>
      <PaginationPrevious href='#' />
      <PaginationNext href='#' />
    </span>
  ],
  'Arrows only': [
    <TextLink key='p' icon='ArrowLeftIcon'>Previous</TextLink>,
    <TextLink key='n' icon='ArrowRightIcon' trailing>Next</TextLink>
  ]
};
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-sm grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3'>
      {Object.entries(rows).map(([name, items]) => (
        <div key={name} className='contents'>
          <span className='text-xs text-text-muted'>{name}</span>
          <Pagination aria-label={`${name} pagination`}>
            <PaginationContent className='w-full justify-between'>
              {items.map((item) => (
                <PaginationItem key={item.key}>{item}</PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      ))}
    </div>
  );
}
