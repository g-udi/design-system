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
export function Pattern() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            aria-label='Project and contributor'
            href='#'
            className='flex items-center gap-2'
          >
            <Avatar className='size-5 rounded-sm'>
              <AvatarImage src='https://github.com/vercel.png' />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            Vercel
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            aria-label='Project and contributor'
            href='#'
            className='flex items-center gap-2'
          >
            <Avatar className='size-5'>
              <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            @alexjohnson
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Projects</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
