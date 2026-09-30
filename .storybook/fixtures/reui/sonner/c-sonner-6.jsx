// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { toast } from 'sonner';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Button
        onClick={() =>
          toast('Message archived', {
            description: 'The conversation has been moved to archive.',
            action: {
              label: 'Undo',
              onClick: () => toast.success('Action undone')
            }
          })
        }
        variant='outline'
        className='w-fit'
      >
        Toast with Action
      </Button>
    </div>
  );
}
