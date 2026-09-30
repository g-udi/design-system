// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='#'>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <RegistryIcon lucide='ChevronsRightIcon' />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href='#'>Resources</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <RegistryIcon lucide='ChevronsRightIcon' />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Documentation</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
