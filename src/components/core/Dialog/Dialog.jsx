'use client';

import { useRef } from 'react';
import * as Primitive from '@radix-ui/react-dialog';
import Icon from '../Icon';
import Button from '../Button';
import DialogConfirmation from './DialogConfirmation';
import { cn } from '../../../utilities/cn';

export const DialogClose = Primitive.Close;

/*
 * Full-screen surfaces (lightboxes, players, palettes, mobile menus) bring their own layout;
 * Radix still owns the portal, focus trap, scroll lock, Escape and inert background.
 * Focus returns to the element focused before opening, or to restoreFocusRef when that is gone.
 */
function BareDialog({ trigger, title, label, children, open, defaultOpen, onOpenChange, className, contentProps, container, initialFocusRef, restoreFocusRef, ...props }) {
  const previousFocus = useRef(null);
  const labelledBy = contentProps?.['aria-labelledby'];
  return (
    <Primitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} {...props}>
      {trigger && <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>}
      <Primitive.Portal container={container}>
        <Primitive.Content
          aria-describedby={undefined}
          aria-modal='true'
          {...contentProps}
          onOpenAutoFocus={(event) => {
            // Record the opener before focus moves inside, so it can be restored on close.
            previousFocus.current = document.activeElement;
            contentProps?.onOpenAutoFocus?.(event);
            if (!initialFocusRef?.current) return;
            event.preventDefault();
            initialFocusRef.current.focus();
          }}
          onCloseAutoFocus={(event) => {
            contentProps?.onCloseAutoFocus?.(event);
            if (event.defaultPrevented) return;
            // Without a Radix trigger, return focus to the opener (or the fallback) ourselves.
            const previous = previousFocus.current;
            const target = previous?.isConnected && previous !== document.body ? previous : restoreFocusRef?.current;
            if (trigger && !target) return;
            event.preventDefault();
            target?.focus();
          }}
          onClick={(event) => {
            contentProps?.onClick?.(event);
            if (event.target === event.currentTarget) onOpenChange?.(false);
          }}
          className={className}
        >
          {/* A visible heading can label the dialog; the hidden title then stays out of the reading order. */}
          <Primitive.Title className='sr-only' aria-hidden={labelledBy ? true : undefined}>{title || label}</Primitive.Title>
          {children}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}

/** Modal, sheet, confirmation and bare full-screen surfaces share one public component. */
export default function Dialog({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  defaultOpen,
  onOpenChange,
  variant = 'modal',
  closeLabel = 'Close dialog',
  className,
  contentProps,
  onConfirm,
  confirmLabel,
  cancelLabel,
  pendingLabel,
  errorMessage,
  tone,
  label,
  container,
  initialFocusRef,
  restoreFocusRef,
  ...props
}) {
  if (variant === 'bare') {
    return (
      <BareDialog
        {...props}
        {...{ trigger, title, label, children, open, defaultOpen, onOpenChange, className, contentProps, container, initialFocusRef, restoreFocusRef }}
      />
    );
  }
  if (variant === 'confirmation') {
    return (
      <DialogConfirmation
        trigger={trigger}
        title={title}
        description={description}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        pendingLabel={pendingLabel}
        errorMessage={errorMessage}
        tone={tone}
      />
    );
  }
  return (
    <Primitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      {...props}
    >
      {trigger && <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>}
      <Primitive.Portal>
        <Primitive.Overlay className='ds-overlay' />
        <Primitive.Content
          {...(!description ? { 'aria-describedby': undefined } : {})}
          {...contentProps}
          className={cn(
            'ds-dialog',
            variant === 'sheet' && 'ds-sheet',
            className
          )}
        >
          <header className='ds-dialog-header'>
            <Primitive.Title className='ds-title'>{title}</Primitive.Title>
            {description && (
              <Primitive.Description className='ds-description'>
                {description}
              </Primitive.Description>
            )}
            <Primitive.Close asChild>
              <Button
                variant='ghost'
                tone='neutral'
                size='xs'
                className='ds-dialog-close'
                aria-label={closeLabel}
              >
                <Icon name='X' decorative size='sm' />
              </Button>
            </Primitive.Close>
          </header>
          <div className='ds-dialog-body'>{children}</div>
          {footer && <footer className='ds-dialog-footer'>{footer}</footer>}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
