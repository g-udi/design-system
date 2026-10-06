'use client';
import { cn } from '../../../utilities/cn/index.js';
import { Dialog as SheetPrimitive } from 'radix-ui';
import { default as Button } from '../Button/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
function Sheet({ ...props }) {
  return <SheetPrimitive.Root data-slot='sheet' {...props} />;
}
function SheetTrigger({ ...props }) {
  return <SheetPrimitive.Trigger data-slot='sheet-trigger' {...props} />;
}
function SheetClose({ ...props }) {
  return <SheetPrimitive.Close data-slot='sheet-close' {...props} />;
}
function SheetPortal({ ...props }) {
  return <SheetPrimitive.Portal data-slot='sheet-portal' {...props} />;
}
function SheetOverlay({ className, ...props }) {
  return (
    <SheetPrimitive.Overlay
      data-slot='sheet-overlay'
      className={cn(
        'ds-part-sheet-overlay fixed inset-0 z-(--ds-z-overlay) duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className
      )}
      {...props}
    />
  );
}
// Widths for side sheets; top and bottom sheets span the screen.
const sizeClass = {
  sm: '',
  md: 'sm:data-[side=left]:max-w-md sm:data-[side=right]:max-w-md',
  lg: 'sm:data-[side=left]:max-w-lg sm:data-[side=right]:max-w-lg',
  xl: 'sm:data-[side=left]:max-w-2xl sm:data-[side=right]:max-w-2xl'
};
const sheetOverlays = { dim: 'bg-black/40', blur: 'bg-black/20 backdrop-blur-sm' };
// An inset sheet floats off the edge with its own rounded border.
const insetClass =
  'rounded-xl border data-[side=right]:inset-y-2 data-[side=right]:right-2 data-[side=right]:h-auto data-[side=left]:inset-y-2 data-[side=left]:left-2 data-[side=left]:h-auto data-[side=top]:inset-x-2 data-[side=top]:top-2 data-[side=bottom]:inset-x-2 data-[side=bottom]:bottom-2';

function SheetContent({
  className,
  children,
  side = 'right',
  size = 'sm',
  inset = false,
  overlay = 'dim',
  showCloseButton = true,
  container,
  ...props
}) {
  return (
    <SheetPortal container={container}>
      <SheetOverlay className={sheetOverlays[overlay]} />
      <SheetPrimitive.Content
        data-slot='sheet-content'
        data-side={side}
        data-inset={inset || undefined}
        className={cn(
          'ds-part-sheet-content data-open:animate-in data-open:fade-in-0 data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:animate-out data-closed:fade-out-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=right]:data-closed:slide-out-to-right-10 data-[side=top]:data-closed:slide-out-to-top-10',
          sizeClass[size],
          inset && insetClass,
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close data-slot='sheet-close' asChild>
            <Button
              variant='ghost'
              className='ds-part-sheet-close'
              size='icon-sm'
            >
              <RegistryIcon lucide='XIcon' />
              <span className='sr-only'>Close</span>
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}
function SheetHeader({ className, ...props }) {
  return (
    <div
      data-slot='sheet-header'
      className={cn('ds-part-sheet-header flex flex-col', className)}
      {...props}
    />
  );
}
function SheetFooter({ className, ...props }) {
  return (
    <div
      data-slot='sheet-footer'
      className={cn('ds-part-sheet-footer mt-auto flex flex-col', className)}
      {...props}
    />
  );
}
function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title
      data-slot='sheet-title'
      className={cn('ds-part-sheet-title ds-part-font-heading', className)}
      {...props}
    />
  );
}
function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description
      data-slot='sheet-description'
      className={cn('ds-part-sheet-description', className)}
      {...props}
    />
  );
}
export {
  sheetOverlays,
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
};
