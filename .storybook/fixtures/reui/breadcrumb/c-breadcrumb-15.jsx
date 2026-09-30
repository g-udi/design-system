// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
                aria-label='Vercel workspace'
                href='#'
                className='text-ui-foreground flex items-center gap-2'
              >
                <Avatar className='size-6'>
                  <AvatarImage src='https://github.com/vercel.png' />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className='text-ui-muted-foreground'>
              /
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink href='#' className='flex items-center gap-3'>
                <Avatar className='size-6'>
                  <AvatarImage
                    src='https://randomuser.me/api/portraits/men/32.jpg'
                    className='object-cover'
                  />
                  <AvatarFallback>MP</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='text-ui-foreground leading-tight font-medium'>
                    shadcn
                  </span>
                  <span className='text-ui-muted-foreground leading-tight'>
                    ui@alexjohnson.com
                  </span>
                </div>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className='text-ui-muted-foreground'>
              /
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage className='flex items-center gap-2.5'>
                <span className='flex size-6 items-center justify-center rounded-md bg-sky-100 text-sky-500 dark:bg-sky-500/10 dark:text-sky-400'>
                  <RegistryIcon lucide='FileTextIcon' className='size-3.5' />
                </span>
                <div className='flex flex-col'>
                  <span className='text-ui-foreground leading-tight font-medium'>
                    Document
                  </span>
                  <span className='text-ui-muted-foreground flex items-center gap-1 leading-tight'>
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
