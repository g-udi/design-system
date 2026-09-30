// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { Popover as PopoverPrimitive } from 'radix-ui';
function Popover({ ...props }) {
  return <PopoverPrimitive.Root data-slot='popover' {...props} />;
}
function PopoverTrigger({ ...props }) {
  return <PopoverPrimitive.Trigger data-slot='popover-trigger' {...props} />;
}
function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot='popover-content'
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'ds-part-popover-content z-50 w-72 origin-(--radix-popover-content-transform-origin) outline-hidden',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
function PopoverAnchor({ ...props }) {
  return <PopoverPrimitive.Anchor data-slot='popover-anchor' {...props} />;
}
function PopoverHeader({ className, ...props }) {
  return (
    <div
      data-slot='popover-header'
      className={cn('ds-part-popover-header', className)}
      {...props}
    />
  );
}
function PopoverTitle({ className, ...props }) {
  return (
    <div
      data-slot='popover-title'
      className={cn('ds-part-popover-title', className)}
      {...props}
    />
  );
}
function PopoverDescription({ className, ...props }) {
  return (
    <p
      data-slot='popover-description'
      className={cn('ds-part-popover-description', className)}
      {...props}
    />
  );
}
export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
};
