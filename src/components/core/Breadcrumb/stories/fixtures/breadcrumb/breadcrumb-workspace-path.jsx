import { IconTile } from '@gaudi/design-system/core/Icon';
import { Frame, FramePanel } from '@gaudi/design-system/core/Card';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import {
  BreadcrumbRoot as Breadcrumb,
  BreadcrumbItemPrimitive as BreadcrumbItem,
  BreadcrumbLinkPrimitive as BreadcrumbLink,
  BreadcrumbListPrimitive as BreadcrumbList,
  BreadcrumbPagePrimitive as BreadcrumbPage,
  BreadcrumbSeparatorPrimitive as BreadcrumbSeparator
} from '@gaudi/design-system/core/Breadcrumb';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  return (
    <Frame spacing='sm'>
      <FramePanel>
        <Breadcrumb>
          <BreadcrumbList className='gap-3'>
            <BreadcrumbItem>
              <BreadcrumbLink
                aria-label='Gaudi organization'
                href='https://github.com/g-udi'
                className='text-text flex items-center gap-2'
              >
                <Avatar className='size-6'>
                  <AvatarImage src='static/images/art/4.svg' />
                  <AvatarFallback>GA</AvatarFallback>
                </Avatar>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className='text-text-muted'>/</BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink href='https://github.com/g-udi/design-system' className='flex items-center gap-3'>
                <Avatar className='size-6'>
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='text-text leading-tight font-medium'>Design system</span>
                  <span className='text-text-muted leading-tight'>g-udi/design-system</span>
                </div>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className='text-text-muted'>/</BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage className='flex items-center gap-2.5'>
                <IconTile aria-hidden='true' size='xs' variant='muted' className='bg-info-subtle text-info'>
                  <RegistryIcon lucide='FileTextIcon' className='size-3.5' />
                </IconTile>
                <div className='flex flex-col'>
                  <span className='text-text leading-tight font-medium'>Document</span>
                  <span className='text-text-muted flex items-center gap-1 leading-tight'>AGENTS.md</span>
                </div>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </FramePanel>
    </Frame>
  );
}
