'use client';
import { useId } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { default as ToastProvider, toast } from '@gaudi/design-system/core/Toast';
export function Pattern() {
  const toasterId = useId();
  // An action offers a follow-up such as Undo; adding cancel turns the toast into a lightweight confirmation.
  const archive = () =>
    toast('Message archived', {
      toasterId,
      description: 'The conversation moved to Archive.',
      action: { label: 'Undo', onClick: () => toast.success('Message restored', { toasterId }) }
    });
  const remove = () =>
    toast('Delete this item?', {
      toasterId,
      duration: Infinity,
      description: 'It will be removed permanently.',
      action: { label: 'Delete', onClick: () => toast.success('Item deleted', { toasterId }) },
      cancel: { label: 'Cancel', onClick: () => {} },
      classNames: { actionButton: 'shrink-0', cancelButton: 'shrink-0' }
    });
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <Button size='sm' variant='outline' tone='neutral' onClick={archive}>
        Archive message
      </Button>
      <Button size='sm' variant='outline' tone='danger' onClick={remove}>
        Delete item
      </Button>
      <ToastProvider id={toasterId} />
    </div>
  );
}
