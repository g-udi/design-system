// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cn } from '../../../../utilities/cn/index.js';
import { Slot } from 'radix-ui';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function Breadcrumb({ className, ...props }) {
  return (
    <nav
      aria-label='breadcrumb'
      data-slot='breadcrumb'
      className={cn('ds-part-breadcrumb', className)}
      {...props}
    />
  );
}
function BreadcrumbList({ className, ...props }) {
  return (
    <ol
      data-slot='breadcrumb-list'
      className={cn(
        'ds-part-breadcrumb-list flex flex-wrap items-center wrap-break-word',
        className
      )}
      {...props}
    />
  );
}
function BreadcrumbItem({ className, ...props }) {
  return (
    <li
      data-slot='breadcrumb-item'
      className={cn(
        'ds-part-breadcrumb-item inline-flex items-center',
        className
      )}
      {...props}
    />
  );
}
function BreadcrumbLink({ asChild, className, ...props }) {
  const Comp = asChild ? Slot.Root : 'a';
  return (
    <Comp
      data-slot='breadcrumb-link'
      className={cn('ds-part-breadcrumb-link', className)}
      {...props}
    />
  );
}
function BreadcrumbPage({ className, ...props }) {
  return (
    <span
      data-slot='breadcrumb-page'
      role='link'
      aria-disabled='true'
      aria-current='page'
      className={cn('ds-part-breadcrumb-page', className)}
      {...props}
    />
  );
}
function BreadcrumbSeparator({ children, className, ...props }) {
  return (
    <li
      data-slot='breadcrumb-separator'
      role='presentation'
      aria-hidden='true'
      className={cn('ds-part-breadcrumb-separator', className)}
      {...props}
    >
      {children ?? (
        <RegistryIcon lucide='ChevronRightIcon' className='ds-part-rtl-flip' />
      )}
    </li>
  );
}
function BreadcrumbEllipsis({ className, ...props }) {
  return (
    <span
      data-slot='breadcrumb-ellipsis'
      role='presentation'
      aria-hidden='true'
      className={cn(
        'ds-part-breadcrumb-ellipsis flex items-center justify-center',
        className
      )}
      {...props}
    >
      <RegistryIcon lucide='MoreHorizontalIcon' />
      <span className='sr-only'>More</span>
    </span>
  );
}
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
};
