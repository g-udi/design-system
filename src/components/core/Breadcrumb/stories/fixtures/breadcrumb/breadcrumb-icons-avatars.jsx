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
import { default as Button } from '@gaudi/design-system/core/Button';
import { Badge } from '@gaudi/design-system/core/Pill';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const Item = ({ children, current }) => (
  <BreadcrumbItem>
    {current ? (
      <BreadcrumbPage className='flex items-center gap-1.5'>{children}</BreadcrumbPage>
    ) : (
      <BreadcrumbLink href='#' className='flex items-center gap-1.5'>{children}</BreadcrumbLink>
    )}
  </BreadcrumbItem>
);
const Glyph = ({ name }) => <RegistryIcon lucide={name} className='size-4' aria-hidden='true' />;
const rows = [
  {
    label: 'Icons',
    items: [
      <Item key='a'><Glyph name='HouseIcon' />Home</Item>,
      <Item key='b'><Glyph name='LayoutDashboardIcon' />Components</Item>,
      <Item key='c' current><Glyph name='SettingsIcon' />Settings</Item>
    ]
  },
  {
    label: 'Home button',
    items: [
      <BreadcrumbItem key='a'>
        <BreadcrumbLink asChild>
          <Button size='icon-sm' variant='outline' aria-label='Home'>
            <Glyph name='HouseIcon' />
          </Button>
        </BreadcrumbLink>
      </BreadcrumbItem>,
      <Item key='b'>Help Center</Item>,
      <Item key='c' current>Getting started</Item>
    ]
  },
  {
    label: 'Count badge',
    items: [
      <Item key='a'>
        Inbox
        <Badge variant='destructive-outline' size='sm' className='rounded-control'>3</Badge>
      </Item>,
      <Item key='b'>Labels</Item>,
      <Item key='c' current>Important</Item>
    ]
  },
  {
    label: 'Avatars',
    items: [
      <Item key='a'>
        <Avatar className='size-5 rounded-sm'>
          <AvatarImage src='static/images/art/4.svg' alt='' />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        Gaudi
      </Item>,
      <Item key='b'>
        <Avatar className='size-5'>
          <AvatarImage src='/avatars/person-41.svg' alt='' />
          <AvatarFallback>AJ</AvatarFallback>
        </Avatar>
        @alexjohnson
      </Item>,
      <Item key='c' current>Projects</Item>
    ]
  }
];
export function Pattern() {
  return (
    <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3'>
      {rows.map(({ label, items }) => (
        <div key={label} className='contents'>
          <span className='text-xs text-text-muted'>{label}</span>
          <Breadcrumb aria-label={`${label} breadcrumb`}>
            <BreadcrumbList>
              {items.flatMap((item, index) => (index ? [<BreadcrumbSeparator key={`s${index}`} />, item] : [item]))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      ))}
    </div>
  );
}
