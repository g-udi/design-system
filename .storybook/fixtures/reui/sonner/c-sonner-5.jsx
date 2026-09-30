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
        onClick={() =>
          toast('Quick notice', {
            description: 'Disappears in 2 seconds.',
            duration: 2e3
          })
        }
      >
        2s Duration
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='w-full'
        onClick={() =>
          toast('Standard notice', {
            description: 'Disappears in 5 seconds.',
            duration: 5e3
          })
        }
      >
        5s Duration
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='w-full'
        onClick={() =>
          toast('Extended notice', {
            description: 'Stays for 10 seconds.',
            duration: 1e4
          })
        }
      >
        10s Duration
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='col-span-3 w-full'
        onClick={() =>
          toast('Persistent notice', {
            description: 'This toast stays until dismissed.',
            duration: Infinity,
            closeButton: true
          })
        }
      >
        Persistent
      </Button>
    </div>
  );
}
