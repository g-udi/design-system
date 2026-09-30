'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertDialog as Primitive } from 'radix-ui';
import Button from '../Button';
import { DialogConfirmation as ConfirmationRoot, DialogConfirmationPortal, DialogConfirmationTrigger } from './parts/dialog-confirmation.jsx';

/** Rejected async actions retain the dialog and provide a retry path. */
export default function DialogConfirmation({
  trigger,
  title,
  description,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  pendingLabel = 'Working…',
  errorMessage = 'The action could not be completed. Please try again.',
  tone = 'danger',
  open,
  defaultOpen = false,
  onOpenChange
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const change = (next) => {
    if (!busy.current) {
      setInternalOpen(next);
      setError(false);
      onOpenChange?.(next);
    }
  };
  const confirm = async () => {
    if (busy.current || !onConfirm) return;
    busy.current = true;
    setPending(true);
    setError(false);
    try {
      await onConfirm();
      busy.current = false;
      if (mounted.current) change(false);
    } catch {
      if (mounted.current) setError(true);
    } finally {
      busy.current = false;
      if (mounted.current) setPending(false);
    }
  };
  return (
    <ConfirmationRoot open={open ?? internalOpen} onOpenChange={change}>
      {trigger && <DialogConfirmationTrigger asChild>{trigger}</DialogConfirmationTrigger>}
      <DialogConfirmationPortal>
        <Primitive.Overlay className='ds-overlay' />
        <Primitive.Content
          className='ds-dialog'
          aria-busy={pending}
          onEscapeKeyDown={(e) => {
            if (pending) e.preventDefault();
          }}
        >
          <header className='ds-dialog-header'>
            <Primitive.Title className='ds-title'>{title}</Primitive.Title>
            <Primitive.Description className='ds-description'>
              {description}
            </Primitive.Description>
          </header>
          {error && (
            <p className='ds-error ds-dialog-body' role='alert'>
              {errorMessage}
            </p>
          )}
          <footer className='ds-dialog-footer'>
            <Primitive.Cancel asChild>
              <Button variant='outline' tone='neutral' disabled={pending}>
                {cancelLabel}
              </Button>
            </Primitive.Cancel>
            <Button
              tone={tone}
              disabled={pending || !onConfirm}
              onClick={confirm}
            >
              {pending ? pendingLabel : confirmLabel}
            </Button>
          </footer>
        </Primitive.Content>
      </DialogConfirmationPortal>
    </ConfirmationRoot>
  );
}
