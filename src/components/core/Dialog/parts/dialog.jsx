'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { default as Button } from '../../Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function Dialog({ ...props }) {
  return <DialogPrimitive.Root data-slot='dialog' {...props} />;
}
function DialogTrigger({ ...props }) {
  return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />;
}
function DialogPortal({ ...props }) {
  return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />;
}
function DialogClose({ ...props }) {
  return <DialogPrimitive.Close data-slot='dialog-close' {...props} />;
}
function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot='dialog-overlay'
      className={cn(
        'ds-part-dialog-overlay fixed inset-0 isolate z-[calc(var(--ds-z-overlay)+1)]',
        className
      )}
      {...props}
    />
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot='dialog-content'
        className={cn(
          'ds-part-dialog-content fixed top-1/2 left-1/2 z-[calc(var(--ds-z-overlay)+1)] w-full -translate-x-1/2 -translate-y-1/2 outline-none',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot='dialog-close' asChild>
            <Button
              variant='ghost'
              className='ds-part-dialog-close'
              size='icon-sm'
            >
              <RegistryIcon lucide='XIcon' />
              <span className='sr-only'>Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}
function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot='dialog-header'
      className={cn('ds-part-dialog-header flex flex-col', className)}
      {...props}
    />
  );
}
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}) {
  return (
    <div
      data-slot='dialog-footer'
      className={cn(
        'ds-part-dialog-footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant='outline'>Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}
function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      className={cn('ds-part-dialog-title ds-part-font-heading', className)}
      {...props}
    />
  );
}
function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      className={cn('ds-part-dialog-description', className)}
      {...props}
    />
  );
}
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
};
