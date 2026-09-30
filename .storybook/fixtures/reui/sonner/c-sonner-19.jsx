// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { toast } from 'sonner';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <Button
        size='sm'
        variant='outline'
        className='w-fit'
        onClick={() =>
          toast('Message sent', {
            description: 'Your message has been delivered.',
            icon: <RegistryIcon lucide='SendIcon' className='size-4' />
          })
        }
      >
        Send Icon
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='w-fit'
        onClick={() =>
          toast('Download complete', {
            description: 'design-assets.zip is ready.',
            icon: <RegistryIcon lucide='DownloadIcon' className='size-4' />
          })
        }
      >
        Download Icon
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='w-fit'
        onClick={() =>
          toast('Bookmark added', {
            description: 'Saved to your collection.',
            icon: <RegistryIcon lucide='BookmarkIcon' className='size-4' />
          })
        }
      >
        Bookmark Icon
      </Button>
    </div>
  );
}
