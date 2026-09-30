// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function DropdownMenu({ ...props }) {
  return <DropdownMenuPrimitive.Root data-slot='dropdown-menu' {...props} />;
}
function DropdownMenuPortal({ ...props }) {
  return (
    <DropdownMenuPrimitive.Portal data-slot='dropdown-menu-portal' {...props} />
  );
}
function DropdownMenuTrigger({ ...props }) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot='dropdown-menu-trigger'
      {...props}
    />
  );
}
function DropdownMenuContent({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot='dropdown-menu-content'
        sideOffset={sideOffset}
        align={align}
        className={cn(
          'ds-part-dropdown-menu-content ds-part-menu-target ds-part-menu-translucent z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden',
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}
function DropdownMenuGroup({ ...props }) {
  return (
    <DropdownMenuPrimitive.Group data-slot='dropdown-menu-group' {...props} />
  );
}
function DropdownMenuItem({ className, inset, variant = 'default', ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot='dropdown-menu-item'
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'ds-part-dropdown-menu-item group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    />
  );
}
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot='dropdown-menu-checkbox-item'
      data-inset={inset}
      className={cn(
        'ds-part-dropdown-menu-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className='ds-part-dropdown-menu-item-indicator pointer-events-none'
        data-slot='dropdown-menu-checkbox-item-indicator'
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <RegistryIcon lucide='CheckIcon' />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}
function DropdownMenuRadioGroup({ ...props }) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot='dropdown-menu-radio-group'
      {...props}
    />
  );
}
function DropdownMenuRadioItem({ className, children, inset, ...props }) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot='dropdown-menu-radio-item'
      data-inset={inset}
      className={cn(
        'ds-part-dropdown-menu-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      <span
        className='ds-part-dropdown-menu-item-indicator pointer-events-none'
        data-slot='dropdown-menu-radio-item-indicator'
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <RegistryIcon lucide='CheckIcon' />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}
function DropdownMenuLabel({ className, inset, ...props }) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot='dropdown-menu-label'
      data-inset={inset}
      className={cn('ds-part-dropdown-menu-label', className)}
      {...props}
    />
  );
}
function DropdownMenuSeparator({ className, ...props }) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot='dropdown-menu-separator'
      className={cn('ds-part-dropdown-menu-separator', className)}
      {...props}
    />
  );
}
function DropdownMenuShortcut({ className, ...props }) {
  return (
    <span
      data-slot='dropdown-menu-shortcut'
      className={cn('ds-part-dropdown-menu-shortcut', className)}
      {...props}
    />
  );
}
function DropdownMenuSub({ ...props }) {
  return <DropdownMenuPrimitive.Sub data-slot='dropdown-menu-sub' {...props} />;
}
function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot='dropdown-menu-sub-trigger'
      data-inset={inset}
      className={cn(
        'ds-part-dropdown-menu-sub-trigger flex cursor-default items-center outline-hidden select-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      {children}
      <RegistryIcon
        lucide='ChevronRightIcon'
        className='ds-part-rtl-flip ml-auto'
      />
    </DropdownMenuPrimitive.SubTrigger>
  );
}
function DropdownMenuSubContent({ className, ...props }) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot='dropdown-menu-sub-content'
      className={cn(
        'ds-part-dropdown-menu-sub-content ds-part-menu-target ds-part-menu-translucent z-50 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden',
        className
      )}
      {...props}
    />
  );
}
export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
};
