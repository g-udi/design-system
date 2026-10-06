import {
  BreadcrumbRoot as Breadcrumb,
  BreadcrumbItemPrimitive as BreadcrumbItem,
  BreadcrumbLinkPrimitive as BreadcrumbLink,
  BreadcrumbListPrimitive as BreadcrumbList,
  BreadcrumbPagePrimitive as BreadcrumbPage,
  BreadcrumbSeparatorPrimitive as BreadcrumbSeparator
} from '@gaudi/design-system/core/Breadcrumb';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import {
  Frame,
  FramePanel
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
function Trail() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='#' className='flex items-center gap-1.5'>
            <RegistryIcon lucide='HouseIcon' className='size-4' aria-hidden='true' />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href='#'>Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className='font-semibold'>Checkout</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
function ButtonTrail() {
  return (
    <Breadcrumb aria-label='Workspace breadcrumb'>
      <BreadcrumbList className='gap-1'>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button variant='ghost' size='sm' className='text-text-muted hover:text-text'>
              <RegistryIcon lucide='HouseIcon' />
              Home
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button variant='ghost' size='sm' className='text-text-muted hover:text-text'>
              <RegistryIcon lucide='LayoutGridIcon' />
              Workspace
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            <span className='inline-flex h-7 items-center gap-1.5 rounded-control bg-surface-muted px-2.5 text-sm font-medium text-text'>
              <RegistryIcon lucide='SettingsIcon' className='size-4' aria-hidden='true' />
              Settings
            </span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export function Pattern() {
  return (
    <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3'>
      <span className='text-xs text-text-muted'>Card</span>
      <Card className='w-fit p-2'>
        <CardContent className='px-1 py-0'>
          <Trail />
        </CardContent>
      </Card>
      <span className='text-xs text-text-muted'>Frame</span>
      <Frame className='w-fit'>
        <FramePanel className='px-3! py-2!'>
          <Trail />
        </FramePanel>
      </Frame>
      <span className='text-xs text-text-muted'>Buttons</span>
      <ButtonTrail />
    </div>
  );
}
