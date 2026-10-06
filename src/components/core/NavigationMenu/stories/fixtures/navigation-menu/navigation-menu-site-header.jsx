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
const guides = [
  { title: 'Introduction', description: 'What Gaudi is, and how tokens, components and patterns fit together.' },
  { title: 'Installation', description: 'Install the package, load the styles and wire up the theme.' }
];
const components = [
  { title: 'Alert Dialog', description: 'Asks for a decision before the reader continues.' },
  { title: 'Hover Card', description: 'Preview the content behind a link without leaving the page.' },
  { title: 'Progress', description: 'Shows how far a task has come towards completion.' },
  { title: 'Scroll Area', description: 'A styled scroll container that keeps native behaviour.' }
];
const statuses = [
  { title: 'Backlog', icon: 'CircleDashedIcon' },
  { title: 'In progress', icon: 'CircleAlertIcon' },
  { title: 'Done', icon: 'CircleCheckIcon' }
];
const solutions = [
  { title: 'Individuals', description: 'Write and publish on your own.', icon: 'UserIcon' },
  { title: 'Freelancers', description: 'For one author with a small archive.', icon: 'CircleDollarSignIcon' },
  { title: 'Small businesses', description: 'Editors, roles and review queues.', icon: 'SparklesIcon' },
  { title: 'Enterprises', description: 'Several publications under one roof.', icon: 'BuildingIcon' }
];
function Item({ title, description, icon, className }) {
  return (
    <li>
      <NavigationMenuLink asChild className={className}>
        <a href='#'>
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
                {guides.map((item) => <Item key={item.title} {...item} className='p-2' />)}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid w-[min(28rem,calc(100vw-2rem))] grid-cols-1 gap-1 sm:grid-cols-2'>
                {components.map((item) => <Item key={item.title} {...item} className='p-2' />)}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Status</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid w-44 gap-1'>
                {statuses.map((item) => <Item key={item.title} {...item} className='flex-row items-center gap-2' />)}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className='grid w-[min(28rem,calc(100vw-2rem))] gap-2'>
                <ul className='grid grid-cols-1 gap-1 sm:grid-cols-2'>
                  {solutions.map((item) => <Item key={item.title} {...item} className='flex-row items-start gap-2 p-2' />)}
                </ul>
                <Button className='w-full' size='sm' asChild>
                  <a href='#'>Compare plans</a>
                </Button>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <a href='#'>Documentation</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
