'use client';
import { cn } from '../../../utilities/cn/index.js';
import { Menubar as MenubarPrimitive } from 'radix-ui';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
function Menubar({ className, ...props }) {
  return (
    <MenubarPrimitive.Root
      data-slot='menubar'
      className={cn('ds-part-menubar flex items-center', className)}
      {...props}
    />
  );
}
function MenubarMenu({ ...props }) {
  return <MenubarPrimitive.Menu data-slot='menubar-menu' {...props} />;
}
function MenubarGroup({ ...props }) {
  return <MenubarPrimitive.Group data-slot='menubar-group' {...props} />;
}
function MenubarPortal({ ...props }) {
  return <MenubarPrimitive.Portal data-slot='menubar-portal' {...props} />;
}
function MenubarRadioGroup({ ...props }) {
  return (
    <MenubarPrimitive.RadioGroup data-slot='menubar-radio-group' {...props} />
  );
}
function MenubarTrigger({ className, ...props }) {
  return (
    <MenubarPrimitive.Trigger
      data-slot='menubar-trigger'
      className={cn(
        'ds-part-menubar-trigger flex items-center outline-hidden select-none',
        className
      )}
      {...props}
    />
  );
}
function MenubarContent({
  className,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  ...props
}) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot='menubar-content'
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'ds-part-menubar-content ds-part-menu-target ds-part-menu-translucent z-[calc(var(--ds-z-overlay)+1)] origin-(--radix-menubar-content-transform-origin) overflow-hidden',
          className
        )}
        {...props}
      />
    </MenubarPortal>
  );
}
function MenubarItem({ className, inset, variant = 'default', ...props }) {
  return (
    <MenubarPrimitive.Item
      data-slot='menubar-item'
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'ds-part-menubar-item group/menubar-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    />
  );
}
function MenubarCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot='menubar-checkbox-item'
      data-inset={inset}
      className={cn(
        'ds-part-menubar-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className='ds-part-menubar-checkbox-item-indicator pointer-events-none absolute flex items-center justify-center'>
        <MenubarPrimitive.ItemIndicator>
          <RegistryIcon lucide='CheckIcon' />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}
function MenubarRadioItem({ className, children, inset, ...props }) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot='menubar-radio-item'
      data-inset={inset}
      className={cn(
        'ds-part-menubar-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      <span className='ds-part-menubar-radio-item-indicator pointer-events-none absolute flex items-center justify-center'>
        <MenubarPrimitive.ItemIndicator>
          <RegistryIcon lucide='CheckIcon' />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}
function MenubarLabel({ className, inset, ...props }) {
  return (
    <MenubarPrimitive.Label
      data-slot='menubar-label'
      data-inset={inset}
      className={cn('ds-part-menubar-label', className)}
      {...props}
    />
  );
}
function MenubarSeparator({ className, ...props }) {
  return (
    <MenubarPrimitive.Separator
      data-slot='menubar-separator'
      className={cn('ds-part-menubar-separator -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}
function MenubarShortcut({ className, ...props }) {
  return (
    <span
      data-slot='menubar-shortcut'
      className={cn('ds-part-menubar-shortcut ml-auto', className)}
      {...props}
    />
  );
}
function MenubarSub({ ...props }) {
  return <MenubarPrimitive.Sub data-slot='menubar-sub' {...props} />;
}
function MenubarSubTrigger({ className, inset, children, ...props }) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot='menubar-sub-trigger'
      data-inset={inset}
      className={cn(
        'ds-part-menubar-sub-trigger flex cursor-default items-center outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <RegistryIcon
        lucide='ChevronRightIcon'
        className='ds-part-rtl-flip ml-auto size-4'
      />
    </MenubarPrimitive.SubTrigger>
  );
}
function MenubarSubContent({ className, ...props }) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.SubContent
        data-slot='menubar-sub-content'
        className={cn(
          'ds-part-menubar-sub-content ds-part-menu-target ds-part-menu-translucent z-[calc(var(--ds-z-overlay)+1)] origin-(--radix-menubar-content-transform-origin) overflow-hidden',
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
}
export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent
};
