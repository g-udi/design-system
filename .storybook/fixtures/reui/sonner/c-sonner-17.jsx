// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { toast } from 'sonner';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
const reviewers = [
  {
    name: 'Alex Johnson',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'AJ'
  },
  {
    name: 'Sarah Chen',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'SC'
  },
  {
    name: 'David Kim',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    initials: 'DK'
  }
];
export function Pattern() {
  const showToast = () => {
    toast.custom(() => (
      <div className='bg-invert text-invert-foreground rounded-md flex w-[356px] flex-col gap-3 border border-transparent p-4 shadow-lg'>
        <div className='flex items-center justify-between'>
          <p className='text-sm font-semibold'>Pull Request #284</p>
          <span className='text-invert-foreground/40 text-xs'>2m ago</span>
        </div>
        <p className='text-invert-foreground/70 text-sm'>
          All reviewers approved. Ready to merge into{' '}
          <code className='bg-ui-background/10 rounded px-1 py-0.5 font-mono text-xs'>
            main
          </code>
        </p>
        <Separator className='bg-ui-border/10' />
        <div className='flex items-center justify-between'>
          <div className='flex -space-x-2'>
            {reviewers.map((reviewer) => (
              <Avatar
                key={reviewer.name}
                className='border-invert size-6 border-2'
              >
                <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                <AvatarFallback className='text-xs'>
                  {reviewer.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className='flex gap-2'>
            <Button
              size='xs'
              variant='outline'
              className='bg-ui-background/10 border-ui-border/10 text-invert-foreground'
              onClick={() => toast.dismiss()}
            >
              View
            </Button>
            <Button
              size='xs'
              className='border-green-800 bg-green-500 text-white hover:border-green-900 hover:bg-green-600'
              onClick={() => {
                toast.dismiss();
                toast.success('Merged successfully');
              }}
            >
              Merge
            </Button>
          </div>
        </div>
      </div>
    ));
  };
  return (
    <div className='flex items-center justify-center'>
      <Button onClick={showToast} variant='outline' className='w-fit'>
        PR Merge Toast
      </Button>
    </div>
  );
}
