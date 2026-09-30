// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { toast } from 'sonner';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  return (
    <div className='grid grid-cols-3 gap-2'>
      <Button
        size='sm'
        variant='outline'
        className='w-full'
        onClick={() => toast('Default notification')}
      >
        Default
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='w-full'
        onClick={() =>
          toast.success('Operation completed', {
            classNames: { icon: 'text-green-500' }
          })
        }
      >
        Success
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='w-full'
        onClick={() =>
          toast.error('Operation failed', {
            classNames: { icon: 'text-ui-destructive' }
          })
        }
      >
        Error
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='w-full'
        onClick={() =>
          toast.warning('Proceed with caution', {
            classNames: { icon: 'text-yellow-500' }
          })
        }
      >
        Warning
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='w-full'
        onClick={() =>
          toast.info('System update available', {
            classNames: { icon: 'text-violet-500' }
          })
        }
      >
        Info
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='w-full'
        onClick={() => toast.loading('Processing...')}
      >
        Loading
      </Button>
    </div>
  );
}
