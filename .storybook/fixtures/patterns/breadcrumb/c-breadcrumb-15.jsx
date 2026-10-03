import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
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
                    src='/avatars/men/32.jpg'
                    className='object-cover'
                  />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='text-text leading-tight font-medium'>
                    Alex Johnson
                  </span>
                  <span className='text-text-muted leading-tight'>
                    alex@acme.com
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
