import { cva } from 'class-variance-authority';
import { cn } from '../../../utilities/cn/index.js';
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
function NavigationMenu({ className, children, viewport = true, ...props }) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot='navigation-menu'
      data-viewport={viewport}
      className={cn(
        'ds-part-navigation-menu group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}
function NavigationMenuList({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.List
      data-slot='navigation-menu-list'
      className={cn(
        'ds-part-navigation-menu-list group flex flex-1 list-none items-center justify-center',
        className
      )}
      {...props}
    />
  );
}
function NavigationMenuItem({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot='navigation-menu-item'
      className={cn('ds-part-navigation-menu-item relative', className)}
      {...props}
    />
  );
}
const navigationMenuTriggerStyle = cva(
  'ds-part-navigation-menu-trigger group/navigation-menu-trigger inline-flex h-8 w-max items-center justify-center outline-none disabled:pointer-events-none'
);
function NavigationMenuTrigger({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot='navigation-menu-trigger'
      className={cn(navigationMenuTriggerStyle(), 'group', className)}
      {...props}
    >
      {children}{' '}
      <RegistryIcon
        lucide='ChevronDownIcon'
        className='ds-part-navigation-menu-trigger-icon'
        aria-hidden='true'
      />
    </NavigationMenuPrimitive.Trigger>
  );
}
function NavigationMenuContent({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot='navigation-menu-content'
      role='group'
      className={cn(
        'ds-part-navigation-menu-content top-0 left-0 w-full group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto',
        className
      )}
      {...props}
    />
  );
}
function NavigationMenuViewport({ className, ...props }) {
  return (
    <div
      className={cn(
        'ds-part-navigation-menu-viewport-wrapper absolute top-full left-0 isolate z-50 flex justify-center'
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot='navigation-menu-viewport'
        className={cn(
          'ds-part-navigation-menu-viewport origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden md:w-(--radix-navigation-menu-viewport-width)',
          className
        )}
        {...props}
      />
    </div>
  );
}
function NavigationMenuLink({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot='navigation-menu-link'
      className={cn('ds-part-navigation-menu-link', className)}
      {...props}
    />
  );
}
function NavigationMenuIndicator({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot='navigation-menu-indicator'
      className={cn(
        'ds-part-navigation-menu-indicator top-full z-1 flex h-1.5 items-end justify-center overflow-hidden',
        className
      )}
      {...props}
    >
      <div className='ds-part-navigation-menu-indicator-arrow relative top-[60%] size-2 rotate-45' />
    </NavigationMenuPrimitive.Indicator>
  );
}
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
};
