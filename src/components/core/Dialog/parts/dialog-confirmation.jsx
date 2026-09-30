// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { AlertDialog as DialogConfirmationPrimitive } from 'radix-ui';
import { default as Button } from '../../Button/index.js';
function DialogConfirmation({ ...props }) {
  return <DialogConfirmationPrimitive.Root data-slot='alert-dialog' {...props} />;
}
function DialogConfirmationTrigger({ ...props }) {
  return (
    <DialogConfirmationPrimitive.Trigger data-slot='alert-dialog-trigger' {...props} />
  );
}
function DialogConfirmationPortal({ ...props }) {
  return (
    <DialogConfirmationPrimitive.Portal data-slot='alert-dialog-portal' {...props} />
  );
}
function DialogConfirmationOverlay({ className, ...props }) {
  return (
    <DialogConfirmationPrimitive.Overlay
      data-slot='alert-dialog-overlay'
      className={cn(
        'ds-part-alert-dialog-overlay fixed inset-0 z-50',
        className
      )}
      {...props}
    />
  );
}
function DialogConfirmationContent({ className, size = 'default', ...props }) {
  return (
    <DialogConfirmationPortal>
      <DialogConfirmationOverlay />
      <DialogConfirmationPrimitive.Content
        data-slot='alert-dialog-content'
        data-size={size}
        className={cn(
          'ds-part-alert-dialog-content group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 outline-none',
          className
        )}
        {...props}
      />
    </DialogConfirmationPortal>
  );
}
function DialogConfirmationHeader({ className, ...props }) {
  return (
    <div
      data-slot='alert-dialog-header'
      className={cn('ds-part-alert-dialog-header', className)}
      {...props}
    />
  );
}
function DialogConfirmationFooter({ className, ...props }) {
  return (
    <div
      data-slot='alert-dialog-footer'
      className={cn(
        'ds-part-alert-dialog-footer flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  );
}
function DialogConfirmationMedia({ className, ...props }) {
  return (
    <div
      data-slot='alert-dialog-media'
      className={cn('ds-part-alert-dialog-media', className)}
      {...props}
    />
  );
}
function DialogConfirmationTitle({ className, ...props }) {
  return (
    <DialogConfirmationPrimitive.Title
      data-slot='alert-dialog-title'
      className={cn(
        'ds-part-alert-dialog-title ds-part-font-heading',
        className
      )}
      {...props}
    />
  );
}
function DialogConfirmationDescription({ className, ...props }) {
  return (
    <DialogConfirmationPrimitive.Description
      data-slot='alert-dialog-description'
      className={cn('ds-part-alert-dialog-description', className)}
      {...props}
    />
  );
}
function DialogConfirmationAction({
  className,
  variant = 'default',
  size = 'default',
  ...props
}) {
  return (
    <Button variant={variant} size={size} asChild>
      <DialogConfirmationPrimitive.Action
        data-slot='alert-dialog-action'
        className={cn('ds-part-alert-dialog-action', className)}
        {...props}
      />
    </Button>
  );
}
function DialogConfirmationCancel({
  className,
  variant = 'outline',
  size = 'default',
  ...props
}) {
  return (
    <Button variant={variant} size={size} asChild>
      <DialogConfirmationPrimitive.Cancel
        data-slot='alert-dialog-cancel'
        className={cn('ds-part-alert-dialog-cancel', className)}
        {...props}
      />
    </Button>
  );
}
export {
  DialogConfirmation,
  DialogConfirmationAction,
  DialogConfirmationCancel,
  DialogConfirmationContent,
  DialogConfirmationDescription,
  DialogConfirmationFooter,
  DialogConfirmationHeader,
  DialogConfirmationMedia,
  DialogConfirmationOverlay,
  DialogConfirmationPortal,
  DialogConfirmationTitle,
  DialogConfirmationTrigger
};
