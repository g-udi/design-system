import {
  BreadcrumbRoot as Breadcrumb,
  BreadcrumbItemPrimitive as BreadcrumbItem,
  BreadcrumbLinkPrimitive as BreadcrumbLink,
  BreadcrumbListPrimitive as BreadcrumbList,
  BreadcrumbPagePrimitive as BreadcrumbPage,
  BreadcrumbSeparatorPrimitive as BreadcrumbSeparator
} from '@gaudi/design-system/core/Breadcrumb';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const Dash = () => <span className='inline-flex h-0.5 w-2 shrink-0 rounded-full bg-text-muted/40' />;
const rows = [
  { label: 'Chevron', separator: undefined },
  { label: 'Slash', separator: '/' },
  { label: 'Double chevron', separator: <RegistryIcon lucide='ChevronsRightIcon' /> },
  { label: 'Dash', separator: <Dash /> }
];
function Trail({ label, separator }) {
  return (
    <Breadcrumb aria-label={`${label} breadcrumb`}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='#'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className='flex items-center'>{separator}</BreadcrumbSeparator>
        <BreadcrumbItem>
          {/* asChild hands the styling to a router link such as next/link. */}
          <BreadcrumbLink asChild>
            <a href='#'>Components</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className='flex items-center'>{separator}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export function Pattern() {
  return (
    <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3'>
      {rows.map((row) => (
        <div key={row.label} className='contents'>
          <span className='text-xs text-text-muted'>{row.label}</span>
          <Trail {...row} />
        </div>
      ))}
    </div>
  );
}
