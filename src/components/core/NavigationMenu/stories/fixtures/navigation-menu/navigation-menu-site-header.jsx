import { default as Button } from '@gaudi/design-system/core/Button';
import {
  NavigationMenuRoot as NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItemPrimitive as NavigationMenuItem,
  NavigationMenuLinkPrimitive as NavigationMenuLink,
  NavigationMenuListPrimitive as NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@gaudi/design-system/core/NavigationMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const docs = 'https://design.gaudi.site/docs';
const guides = [
  { title: 'Introduction', path: '', description: 'How Gaudi’s tokens, components and patterns fit together.' },
  {
    title: 'Installation',
    path: '/getting-started',
    description: 'Install the package, load the styles and set up a theme.'
  }
];
const components = [
  { title: 'Dialog', path: '/components/dialog', description: 'Ask for a decision or show a focused task.' },
  { title: 'Select', path: '/components/select', description: 'Choose one or more options from a list.' },
  { title: 'Calendar', path: '/components/calendar', description: 'Choose a date or a range of dates.' },
  { title: 'Button', path: '/components/button', description: 'Trigger an action or navigate to another page.' }
];
const foundations = [
  { title: 'Colours', path: '/foundations/colours', icon: 'PaletteIcon' },
  { title: 'Typography', path: '/foundations/typography', icon: 'TypeIcon' },
  { title: 'Icons', path: '/foundations/icons', icon: 'ShapesIcon' }
];
const blocks = [
  {
    title: 'App Shell',
    path: '/blocks/app-shell',
    description: 'Sidebars, top bars and application windows.',
    icon: 'LayoutTemplateIcon'
  },
  {
    title: 'Dashboard',
    path: '/blocks/dashboard',
    description: 'Metrics, charts and recent activity.',
    icon: 'LayoutDashboardIcon'
  },
  {
    title: 'Forms',
    path: '/blocks/forms',
    description: 'Checkout, profile and settings forms.',
    icon: 'FileTextIcon'
  },
  {
    title: 'Scheduling',
    path: '/blocks/scheduling',
    description: 'Bookings, availability and time slots.',
    icon: 'CalendarIcon'
  }
];
function Item({ title, description, icon, path, className }) {
  return (
    <li>
      <NavigationMenuLink asChild className={className}>
        <a href={docs + path}>
          {icon ? <RegistryIcon lucide={icon} aria-hidden='true' /> : null}
          {description ? (
            <span className='flex flex-col gap-1'>
              <span className='text-sm leading-none font-medium'>{title}</span>
              <span className='line-clamp-2 text-xs leading-snug text-text-muted'>{description}</span>
            </span>
          ) : (
            title
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
}
export function Pattern() {
  return (
    <div className='flex min-h-64 items-start justify-center'>
      <NavigationMenu>
        <NavigationMenuList className='flex-wrap justify-center'>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid w-72 gap-1'>
                {guides.map((item) => (
                  <Item key={item.title} {...item} className='p-2' />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid w-[min(28rem,calc(100vw-2rem))] grid-cols-1 gap-1 sm:grid-cols-2'>
                {components.map((item) => (
                  <Item key={item.title} {...item} className='p-2' />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Foundations</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid w-44 gap-1'>
                {foundations.map((item) => (
                  <Item key={item.title} {...item} className='flex-row items-center gap-2' />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Blocks</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className='grid w-[min(28rem,calc(100vw-2rem))] gap-2'>
                <ul className='grid grid-cols-1 gap-1 sm:grid-cols-2'>
                  {blocks.map((item) => (
                    <Item key={item.title} {...item} className='flex-row items-start gap-2 p-2' />
                  ))}
                </ul>
                <Button className='w-full' size='sm' asChild>
                  <a href={`${docs}/blocks`}>Browse all blocks</a>
                </Button>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <a href={docs}>Documentation</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
