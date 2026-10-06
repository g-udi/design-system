import { useState } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  PopoverPrimitive as Popover,
  PopoverContentPrimitive as PopoverContent,
  PopoverTitle,
  PopoverTriggerPrimitive as PopoverTrigger
} from '@gaudi/design-system/core/Popover';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const portrait = '/avatars/person-44.svg';
function ProfilePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='h-auto justify-start py-1'>
          <Avatar className='size-6' aria-hidden='true'>
            <AvatarImage src={portrait} alt='' />
            <AvatarFallback>DC</AvatarFallback>
          </Avatar>
          Dorian Chua
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64' align='start'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-start justify-between'>
            <Avatar className='size-10'>
              <AvatarImage src={portrait} alt='Dorian Chua' />
              <AvatarFallback>DC</AvatarFallback>
            </Avatar>
            <Button size='sm' variant='outline'>
              Follow
            </Button>
          </div>
          <div>
            <PopoverTitle>Dorian Chua</PopoverTitle>
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
  const [enabled, setEnabled] = useState(false);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>
          <RegistryIcon lucide='SparklesIcon' aria-hidden='true' />
          Advanced analytics
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label='Advanced analytics' className='w-72 gap-0 overflow-hidden p-0'>
        <PopoverTitle className='flex items-center gap-2 border-b border-border bg-accent-subtle px-3 py-2 text-accent'>
          <RegistryIcon lucide='SparklesIcon' className='size-4' aria-hidden='true' />
          Advanced analytics
          <Badge variant='success' size='xs'>Pro</Badge>
        </PopoverTitle>
        <div className='grid gap-3 p-3'>
          <p className='text-text-muted'>
            Detailed insights, custom reports, and real-time dashboards.
          </p>
          <div className='grid grid-cols-2 gap-2'>
            <Button size='sm' onClick={() => setEnabled(true)} disabled={enabled}>{enabled ? 'Preview enabled' : 'Try Pro preview'}</Button>
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
            <PopoverTitle>Portfolio Pro</PopoverTitle>
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
function NotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' aria-label='Notifications, 3 new'>
          <RegistryIcon lucide='BellIcon' aria-hidden='true' />
          Notifications
          <Badge variant='destructive' size='xs'>3 new</Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label='Notifications' className='w-64'>
        <PopoverTitle>Notifications</PopoverTitle>
        <ul className='m-0 grid list-disc gap-1 ps-4 text-text-muted'>
          {['Sarah commented on your PR', 'Build #421 completed', 'A new team member joined'].map((item) => <li key={item}>{item}</li>)}
        </ul>
        <Link href='#notifications' className='inline-flex items-center gap-1'>
          View all
          <RegistryIcon lucide='ArrowRightIcon' className='size-3.5' aria-hidden='true' />
        </Link>
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
      <NotificationsPopover />
    </div>
  );
}
