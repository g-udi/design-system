'use client';

import { Toaster } from 'sonner';
import { buttonVariants } from '../Button';
import { cn } from '../../../utilities/cn';
export { toast } from 'sonner';

// Sonner renders unstyled; the toast surface uses Gaudi tokens and its buttons reuse the Button variants.
const classNames = {
  toast: 'ds-toast',
  content: 'ds-toast-content',
  title: 'ds-label',
  description: 'ds-description',
  actionButton: buttonVariants({ variant: 'soft', size: 'xs', className: 'shrink-0' }),
  cancelButton: buttonVariants({ variant: 'ghost', tone: 'neutral', size: 'xs', className: 'shrink-0' }),
  // Sonner renders the close button first; `order-last` moves it to the end of the row.
  closeButton: buttonVariants({ variant: 'ghost', tone: 'neutral', size: 'icon-xs', className: 'order-last' })
};

/** Mount once per app. Consumer `toastOptions.classNames` are merged with the Gaudi classes. */
export default function ToastProvider({ toastOptions, ...props }) {
  const custom = toastOptions?.classNames || {};
  return (
    <Toaster
      position='bottom-right'
      closeButton
      {...props}
      toastOptions={{
        ...toastOptions,
        unstyled: true,
        classNames: Object.fromEntries(
          [...new Set([...Object.keys(classNames), ...Object.keys(custom)])].map((key) => [key, cn(classNames[key], custom[key])])
        )
      }}
    />
  );
}
