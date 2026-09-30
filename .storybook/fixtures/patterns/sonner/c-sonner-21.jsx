'use client';
import { useRef } from 'react';
import { toast } from 'sonner';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
function LoadingToast({ message }) {
  return (
    <div className='bg-ui-popover text-ui-popover-foreground border-ui-border rounded-md flex w-[356px] items-center gap-3 border p-4 shadow-lg'>
      <Spinner className='size-4 opacity-60' />
      <p className='text-xs font-medium'>{message}</p>
    </div>
  );
}
function SuccessToast() {
  return (
    <div className='bg-ui-popover text-ui-popover-foreground border-ui-border rounded-md flex w-[356px] items-start gap-3 border p-4 shadow-lg'>
      <div className='flex size-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-white'>
        <RegistryIcon lucide='CheckIcon' className='size-3' />
      </div>
      <div className='flex flex-1 flex-col gap-0.5'>
        <p className='text-xs font-semibold'>Upload complete!</p>
        <p className='text-ui-muted-foreground text-xs'>
          3 files uploaded successfully.
        </p>
      </div>
    </div>
  );
}
export function Pattern() {
  const toastId = useRef(void 0);
  const startProgress = () => {
    toastId.current = toast.custom(
      () => <LoadingToast message='Preparing upload...' />,
      { duration: Infinity }
    );
    setTimeout(() => {
      toast.custom(() => <LoadingToast message='Uploading files... 30%' />, {
        id: toastId.current,
        duration: Infinity
      });
    }, 1e3);
    setTimeout(() => {
      toast.custom(() => <LoadingToast message='Uploading files... 70%' />, {
        id: toastId.current,
        duration: Infinity
      });
    }, 2e3);
    setTimeout(() => {
      toast.custom(() => <SuccessToast />, {
        id: toastId.current,
        duration: 4e3
      });
    }, 3e3);
  };
  return (
    <div className='flex items-center justify-center'>
      <Button onClick={startProgress} variant='outline' className='w-fit'>
        Updatable Toast
      </Button>
    </div>
  );
}
