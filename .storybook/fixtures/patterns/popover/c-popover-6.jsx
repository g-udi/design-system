import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const portrait = '/avatars/men/46.jpg';
function ProfilePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='h-auto justify-start py-1'>
          <Avatar className='size-6'>
            <AvatarImage src={portrait} alt='' />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          Marcus Chen
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64' align='start'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-start justify-between'>
            <Avatar className='size-10'>
              <AvatarImage src={portrait} alt='Marcus Chen' />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <Button size='sm' variant='outline'>
              Follow
            </Button>
          </div>
          <div>
            <p className='font-semibold'>Marcus Chen</p>
            <p className='text-text-muted'>@mchen_design</p>
          </div>
          <p>Product designer specializing in design systems.</p>
          <div className='flex items-center gap-3'>
            <span>
              <span className='font-semibold tabular-nums'>1.2k</span>{' '}
              <span className='text-text-muted'>Followers</span>
            </span>
            <span>
              <span className='font-semibold tabular-nums'>482</span>{' '}
              <span className='text-text-muted'>Following</span>
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
function FeaturePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>
          <RegistryIcon lucide='SparklesIcon' aria-hidden='true' />
          Suggestions
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-72 gap-0 overflow-hidden p-0'>
        <div className='flex items-center gap-2 border-b border-border bg-accent-subtle px-3 py-2 font-semibold text-accent'>
          <RegistryIcon lucide='SparklesIcon' className='size-4' aria-hidden='true' />
          Smart suggestions
        </div>
        <div className='grid gap-3 p-3'>
          <p className='text-text-muted'>
            Recommendations based on your workflow that automate repetitive
            tasks.
          </p>
          <div className='grid grid-cols-2 gap-2'>
            <Button size='sm'>Enable</Button>
            <Button size='sm' variant='outline'>
              Learn more
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
function MediaPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>
          <RegistryIcon lucide='ImageIcon' aria-hidden='true' />
          Preview
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-72 gap-0 overflow-hidden p-0' align='end'>
        <img
          src='static/images/art/0.svg'
          alt='Portfolio template preview'
          width={288}
          height={162}
          className='aspect-video w-full bg-surface-muted object-cover'
        />
        <div className='grid gap-3 p-3'>
          <div>
            <p className='font-semibold'>Portfolio Pro</p>
            <p className='text-text-muted'>
              Photography template with a dark theme.
            </p>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Button size='sm'>Install</Button>
            <Button size='sm' variant='outline'>
              Demo
              <RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <ProfilePopover />
      <FeaturePopover />
      <MediaPopover />
    </div>
  );
}
