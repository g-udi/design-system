import {
  BreadcrumbRoot as Breadcrumb,
  BreadcrumbEllipsisPrimitive as BreadcrumbEllipsis,
  BreadcrumbItemPrimitive as BreadcrumbItem,
  BreadcrumbLinkPrimitive as BreadcrumbLink,
  BreadcrumbListPrimitive as BreadcrumbList,
  BreadcrumbPagePrimitive as BreadcrumbPage,
  BreadcrumbSeparatorPrimitive as BreadcrumbSeparator
} from '@gaudi/design-system/core/Breadcrumb';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
export function Pattern() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='https://design.gaudi.site'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon-sm' variant='ghost'>
                <BreadcrumbEllipsis aria-hidden='true' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuItem asChild>
                <a href='https://design.gaudi.site/docs'>Documentation</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href='https://design.gaudi.site/themes'>Themes</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href='https://github.com/g-udi/design-system'>GitHub</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href='https://design.gaudi.site/docs/components'>Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
