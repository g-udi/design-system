// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { Drawer as DrawerPrimitive } from 'vaul';
function Drawer({ ...props }) {
  return <DrawerPrimitive.Root data-slot='drawer' {...props} />;
}
function DrawerTrigger({ ...props }) {
  return <DrawerPrimitive.Trigger data-slot='drawer-trigger' {...props} />;
}
function DrawerPortal({ ...props }) {
  return <DrawerPrimitive.Portal data-slot='drawer-portal' {...props} />;
}
function DrawerClose({ ...props }) {
  return <DrawerPrimitive.Close data-slot='drawer-close' {...props} />;
}
function DrawerOverlay({ className, ...props }) {
  return (
    <DrawerPrimitive.Overlay
      data-slot='drawer-overlay'
      className={cn(
        'ds-part-drawer-overlay fixed inset-0 z-50 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className
      )}
      {...props}
    />
  );
}
function DrawerContent({ className, children, ...props }) {
  return (
    <DrawerPortal data-slot='drawer-portal'>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot='drawer-content'
        className={cn(
          'ds-part-drawer-content group/drawer-content fixed z-50 data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm',
          className
        )}
        {...props}
      >
        <div className='ds-part-drawer-handle mx-auto hidden shrink-0 group-data-[vaul-drawer-direction=bottom]/drawer-content:block' />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}
function DrawerHeader({ className, ...props }) {
  return (
    <div
      data-slot='drawer-header'
      className={cn(
        'ds-part-drawer-header flex flex-col group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center',
        className
      )}
      {...props}
    />
  );
}
function DrawerFooter({ className, ...props }) {
  return (
    <div
      data-slot='drawer-footer'
      className={cn('ds-part-drawer-footer mt-auto flex flex-col', className)}
      {...props}
    />
  );
}
function DrawerTitle({ className, ...props }) {
  return (
    <DrawerPrimitive.Title
      data-slot='drawer-title'
      className={cn('ds-part-drawer-title ds-part-font-heading', className)}
      {...props}
    />
  );
}
function DrawerDescription({ className, ...props }) {
  return (
    <DrawerPrimitive.Description
      data-slot='drawer-description'
      className={cn('ds-part-drawer-description', className)}
      {...props}
    />
  );
}
export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription
};
