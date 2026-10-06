import {
  Frame,
  FramePanel
} from '@gaudi/design-system/core/Card';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
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
                aria-label='Gaudi workspace'
                href='#'
                className='text-text flex items-center gap-2'
              >
                <Avatar className='size-6'>
                  <AvatarImage src='static/images/art/4.svg' />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className='text-text-muted'>
              /
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink href='#' className='flex items-center gap-3'>
                <Avatar className='size-6'>
                  <AvatarImage
                    src='/avatars/person-41.svg'
                    className='object-cover'
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='text-text leading-tight font-medium'>
                    Anouk Varga
                  </span>
                  <span className='text-text-muted leading-tight'>
                    anouk@acme.com
                  </span>
                </div>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className='text-text-muted'>
              /
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage className='flex items-center gap-2.5'>
                <span className='flex size-6 items-center justify-center rounded-md bg-info-subtle text-info'>
                  <RegistryIcon lucide='FileTextIcon' className='size-3.5' />
                </span>
                <div className='flex flex-col'>
                  <span className='text-text leading-tight font-medium'>
                    Document
                  </span>
                  <span className='text-text-muted flex items-center gap-1 leading-tight'>
                    agents.md
                  </span>
                </div>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </FramePanel>
    </Frame>
  );
}
