'use client';

import * as Primitive from '@radix-ui/react-dialog';
import Icon from '../Icon';
import Button from '../Button';
import DialogConfirmation from './DialogConfirmation';
import { cn } from '../../../utilities/cn';

export const DialogClose = Primitive.Close;

/** Modal, sheet and explicit confirmation surfaces share one public component. */
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
  ...props
}) {
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
