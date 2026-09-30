// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { toast } from 'sonner';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const showToast = () => {
    toast.custom(() => (
      <div className='bg-ui-popover text-ui-popover-foreground border-ui-border rounded-md flex w-[356px] flex-col gap-3 border p-4 shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='rounded-lg flex size-10 shrink-0 items-center justify-center bg-linear-to-br from-violet-500 to-purple-600 text-white shadow-sm'>
            <RegistryIcon
              lucide='LinkIcon'
              className='size-5'
              aria-hidden='true'
            />
          </div>
          <div className='flex flex-1 flex-col gap-0.5'>
            <p className='text-sm font-semibold'>Integration Connected</p>
            <p className='text-ui-muted-foreground text-xs'>
              workspace.slack.com
            </p>
          </div>
          <span className='flex items-center gap-1 text-xs text-green-600'>
            <span className='size-1.5 rounded-full bg-green-500' />
            Active
          </span>
        </div>
        <Separator />
        <div className='text-ui-muted-foreground flex items-center justify-between text-xs'>
          <span>Syncing 3 channels</span>
          <span>Last sync: just now</span>
        </div>
        <div className='flex gap-2'>
          <Button
            size='xs'
            variant='outline'
            className='flex-1'
            onClick={() => toast.dismiss()}
          >
            <RegistryIcon
              lucide='SettingsIcon'
              className='size-3'
              aria-hidden='true'
            />
            Configure
          </Button>
          <Button size='xs' className='flex-1' onClick={() => toast.dismiss()}>
            Open Dashboard
          </Button>
        </div>
      </div>
    ));
  };
  return (
    <div className='flex items-center justify-center'>
      <Button onClick={showToast} variant='outline' className='w-fit'>
        Integration Toast
      </Button>
    </div>
  );
}
