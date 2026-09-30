// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Card className='p-2'>
      <CardContent className='px-1 py-0'>
        <Breadcrumb>
          <BreadcrumbList className='gap-1.5 sm:gap-1.5'>
            <BreadcrumbItem>
              <BreadcrumbLink href='#' className='flex items-center gap-1.5'>
                <RegistryIcon
                  lucide='HouseIcon'
                  className='size-4'
                  aria-hidden='true'
                />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='#'>Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='font-semibold'>
                Checkout
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  );
}
