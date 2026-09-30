// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { toast } from 'sonner';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const showToast = () => {
    toast.custom(() => (
      <div className='bg-ui-popover text-ui-popover-foreground border-ui-border rounded-md flex w-[356px] items-start gap-3 border border-l-4 border-l-blue-500 p-4 shadow-lg'>
        <div className='text-blue-500'>
          <RegistryIcon
            lucide='InfoIcon'
            className='size-5 shrink-0'
            aria-hidden='true'
          />
        </div>
        <div className='flex flex-1 flex-col gap-1'>
          <p className='text-sm font-semibold'>New Version Available</p>
          <p className='text-ui-muted-foreground text-sm'>
            v2.4.0 includes performance improvements and bug fixes.
          </p>
          <div className='mt-2 flex gap-2'>
            <Button size='xs' variant='outline' onClick={() => toast.dismiss()}>
              Later
            </Button>
            <Button size='xs' onClick={() => toast.dismiss()}>
              Update Now
            </Button>
          </div>
        </div>
      </div>
    ));
  };
  return (
    <div className='flex items-center justify-center'>
      <Button onClick={showToast} variant='outline' className='w-fit'>
        Accent Border Toast
      </Button>
    </div>
  );
}
