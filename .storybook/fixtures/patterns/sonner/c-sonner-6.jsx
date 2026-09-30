import { default as Button } from '../../../../src/components/core/Button/index.js';
import { default as ToastProvider, toast } from '../../../../src/components/core/Toast/index.js';
const toasterId = 'toast-actions';
export function Pattern() {
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
      // Keep both labels on one line beside the wrapping description.
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
