'use client';
import { cn } from '../../../utilities/cn/index.js';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
function ContextMenu({ ...props }) {
  return <ContextMenuPrimitive.Root data-slot='context-menu' {...props} />;
}
function ContextMenuTrigger({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot='context-menu-trigger'
      className={cn('ds-part-context-menu-trigger select-none', className)}
      {...props}
    />
  );
}
function ContextMenuGroup({ ...props }) {
  return (
    <ContextMenuPrimitive.Group data-slot='context-menu-group' {...props} />
  );
}
function ContextMenuPortal({ ...props }) {
  return (
    <ContextMenuPrimitive.Portal data-slot='context-menu-portal' {...props} />
  );
}
function ContextMenuSub({ ...props }) {
  return <ContextMenuPrimitive.Sub data-slot='context-menu-sub' {...props} />;
}
function ContextMenuRadioGroup({ ...props }) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot='context-menu-radio-group'
      {...props}
    />
  );
}
function ContextMenuContent({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot='context-menu-content'
        collisionPadding={8}
        className={cn(
          'ds-part-context-menu-content ds-part-menu-target ds-part-menu-translucent z-[calc(var(--ds-z-overlay)+1)] max-h-(--radix-context-menu-content-available-height) origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto',
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}
function ContextMenuItem({ className, inset, variant = 'default', ...props }) {
  return (
    <ContextMenuPrimitive.Item
      data-slot='context-menu-item'
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'ds-part-context-menu-item group/context-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    />
  );
}
function ContextMenuSubTrigger({ className, inset, children, ...props }) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot='context-menu-sub-trigger'
      data-inset={inset}
      className={cn(
        'ds-part-context-menu-sub-trigger flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      {children}
      <RegistryIcon
        lucide='ChevronRightIcon'
        className='ds-part-rtl-flip ml-auto'
      />
    </ContextMenuPrimitive.SubTrigger>
  );
}
function ContextMenuSubContent({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.SubContent
        data-slot='context-menu-sub-content'
        className={cn(
          'ds-part-context-menu-sub-content ds-part-menu-target ds-part-menu-translucent z-[calc(var(--ds-z-overlay)+1)] origin-(--radix-context-menu-content-transform-origin) overflow-hidden',
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot='context-menu-checkbox-item'
      data-inset={inset}
      className={cn(
        'ds-part-context-menu-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className='ds-part-context-menu-item-indicator pointer-events-none'>
        <ContextMenuPrimitive.ItemIndicator>
          <RegistryIcon lucide='CheckIcon' />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}
function ContextMenuRadioItem({ className, children, inset, ...props }) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot='context-menu-radio-item'
      data-inset={inset}
      className={cn(
        'ds-part-context-menu-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      <span className='ds-part-context-menu-item-indicator pointer-events-none'>
        <ContextMenuPrimitive.ItemIndicator>
          <RegistryIcon lucide='CheckIcon' />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}
function ContextMenuLabel({ className, inset, ...props }) {
  return (
    <ContextMenuPrimitive.Label
      data-slot='context-menu-label'
      data-inset={inset}
      className={cn('ds-part-context-menu-label', className)}
      {...props}
    />
  );
}
function ContextMenuSeparator({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot='context-menu-separator'
      className={cn('ds-part-context-menu-separator', className)}
      {...props}
    />
  );
}
function ContextMenuShortcut({ className, ...props }) {
  return (
    <span
      data-slot='context-menu-shortcut'
      className={cn('ds-part-context-menu-shortcut', className)}
      {...props}
    />
  );
}
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup
};
