// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { toast } from 'sonner';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  const showUserToast = () => {
    toast.custom(() => (
      <div className='bg-ui-popover text-ui-popover-foreground border-ui-border rounded-md flex w-[356px] items-start gap-3 border p-4 shadow-lg'>
        <Avatar className='size-9 shrink-0'>
          <AvatarImage
            src='https://randomuser.me/api/portraits/men/32.jpg'
            alt='Alex Johnson'
          />
          <AvatarFallback>AJ</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-col gap-1'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-semibold'>Alex Johnson</p>
            <span className='text-ui-muted-foreground text-xs'>2m ago</span>
          </div>
          <p className='text-ui-muted-foreground text-sm'>
            Hey! I&apos;ve finished the design review. Let me know when
            you&apos;re free to discuss.
          </p>
          <div className='mt-2 flex gap-2'>
            <Button size='xs' variant='outline' onClick={() => toast.dismiss()}>
              Dismiss
            </Button>
            <Button size='xs' onClick={() => toast.dismiss()}>
              Reply
            </Button>
          </div>
        </div>
      </div>
    ));
  };
  return (
    <div className='flex items-center justify-center'>
      <Button onClick={showUserToast} variant='outline' className='w-fit'>
        User Message Toast
      </Button>
    </div>
  );
}
