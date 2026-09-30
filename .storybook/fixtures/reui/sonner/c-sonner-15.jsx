// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { toast } from 'sonner';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  const showToast = () => {
    toast.custom(() => (
      <div className='bg-invert text-invert-foreground rounded-md flex w-[356px] items-start gap-3 border border-transparent p-4 shadow-lg'>
        <Avatar className='border-ui-border/10 size-9 shrink-0 border'>
          <AvatarImage
            src='https://randomuser.me/api/portraits/women/44.jpg'
            alt='Sarah Chen'
          />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-col gap-1'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-semibold'>Sarah Chen</p>
            <span className='text-invert-foreground/40 text-xs'>Just now</span>
          </div>
          <p className='text-invert-foreground/70 text-sm'>
            Invited you to collaborate on &quot;Design System v2&quot;
          </p>
          <div className='mt-2 flex gap-2'>
            <Button
              size='xs'
              variant='outline'
              className='bg-ui-background/10 border-ui-border/10 text-invert-foreground'
              onClick={() => toast.dismiss()}
            >
              Decline
            </Button>
            <Button
              size='xs'
              className='border-blue-800 bg-blue-500 text-white hover:border-blue-900 hover:bg-blue-600'
              onClick={() => toast.dismiss()}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    ));
  };
  return (
    <div className='flex items-center justify-center'>
      <Button onClick={showToast} variant='outline' className='w-fit'>
        Invert Invite Toast
      </Button>
    </div>
  );
}
