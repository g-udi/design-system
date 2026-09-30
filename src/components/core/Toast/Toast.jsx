'use client';

import { Toaster } from 'sonner';
export { toast } from 'sonner';

export default function ToastProvider(props) {
  return (
    <Toaster
      position='bottom-right'
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'ds-toast',
          title: 'ds-label',
          description: 'ds-description',
          actionButton: 'ds-toast-action',
          cancelButton: 'ds-toast-action',
          closeButton: 'ds-toast-close'
        }
      }}
      {...props}
    />
  );
}
