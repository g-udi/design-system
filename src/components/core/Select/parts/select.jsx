// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { Select as SelectPrimitive } from 'radix-ui';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function Select({ ...props }) {
  return <SelectPrimitive.Root data-slot='select' {...props} />;
}
function SelectGroup({ className, ...props }) {
  return (
    <SelectPrimitive.Group
      data-slot='select-group'
      className={cn('ds-part-select-group', className)}
      {...props}
    />
  );
}
function SelectValue({ ...props }) {
  return <SelectPrimitive.Value data-slot='select-value' {...props} />;
}
function SelectTrigger({ className, size = 'default', children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      data-size={size}
      className={cn(
        'ds-part-select-trigger flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <RegistryIcon
          lucide='ChevronDownIcon'
          className='ds-part-select-trigger-icon pointer-events-none'
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
function SelectContent({
  className,
  children,
  position = 'item-aligned',
  align = 'center',
  ...props
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot='select-content'
        data-align-trigger={position === 'item-aligned'}
        className={cn(
          'ds-part-select-content ds-part-menu-target ds-part-menu-translucent relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            'ds-part-select-viewport data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)',
            position === 'popper' && ''
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
function SelectLabel({ className, ...props }) {
  return (
    <SelectPrimitive.Label
      data-slot='select-label'
      className={cn('ds-part-select-label', className)}
      {...props}
    />
  );
}
function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item
      data-slot='select-item'
      className={cn(
        'ds-part-select-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      <span className='ds-part-select-item-indicator'>
        <SelectPrimitive.ItemIndicator>
          <RegistryIcon
            lucide='CheckIcon'
            className='ds-part-select-item-indicator-icon pointer-events-none'
          />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
function SelectSeparator({ className, ...props }) {
  return (
    <SelectPrimitive.Separator
      data-slot='select-separator'
      className={cn('ds-part-select-separator pointer-events-none', className)}
      {...props}
    />
  );
}
function SelectScrollUpButton({ className, ...props }) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot='select-scroll-up-button'
      className={cn('ds-part-select-scroll-up-button', className)}
      {...props}
    >
      <RegistryIcon lucide='ChevronUpIcon' />
    </SelectPrimitive.ScrollUpButton>
  );
}
function SelectScrollDownButton({ className, ...props }) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot='select-scroll-down-button'
      className={cn('ds-part-select-scroll-down-button', className)}
      {...props}
    >
      <RegistryIcon lucide='ChevronDownIcon' />
    </SelectPrimitive.ScrollDownButton>
  );
}
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
};
