import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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
