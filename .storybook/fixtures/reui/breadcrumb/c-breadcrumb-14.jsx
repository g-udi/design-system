// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Breadcrumb>
      <BreadcrumbList className='sm:gap-1'>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button variant='ghost' size='sm'>
              <RegistryIcon lucide='HouseIcon' />
              Home
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <RegistryIcon lucide='ChevronRightIcon' />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button variant='ghost' size='sm'>
              <RegistryIcon lucide='LayoutGridIcon' />
              Workspace
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <RegistryIcon lucide='ChevronRightIcon' />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>
            <Button variant='secondary' size='sm'>
              <RegistryIcon lucide='SettingsIcon' />
              Settings
            </Button>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
