import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@gaudi/design-system/core/Popover';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const portrait = '/avatars/person-20.svg';
function ProfileCard() {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a href='#elena' className='flex items-center gap-2 no-underline'>
          <Avatar className='size-8'>
            <AvatarImage src={portrait} alt='' />
            <AvatarFallback>ES</AvatarFallback>
          </Avatar>
          <span className='grid text-left'>
            <span className='font-medium text-text hover:underline'>Elena Soroka</span>
            <span className='text-xs text-text-muted'>@e.soroka</span>
          </span>
        </a>
      </HoverCardTrigger>
      <HoverCardContent className='w-64'>
        <div className='flex gap-2'>
          <Avatar className='size-10 shrink-0'>
            <AvatarImage src={portrait} alt='Elena Soroka' />
            <AvatarFallback>ES</AvatarFallback>
          </Avatar>
          <div className='grid gap-1'>
            <div>
              <p className='font-medium'>Elena Soroka</p>
              <p className='text-xs text-text-muted'>@e.soroka</p>
            </div>
            <p>Lead product designer.</p>
            <p className='flex items-center gap-1 text-xs text-text-muted'>
              <RegistryIcon lucide='CalendarIcon' className='size-3.5' aria-hidden='true' />
              Joined December 2023
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
function FeatureCard() {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant='outline' size='sm'>
          Instant deployment
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-72'>
        <div className='flex gap-2'>
          <RegistryIcon
            lucide='ZapIcon'
            aria-hidden='true'
            className='mt-0.5 size-4 shrink-0 text-warning'
          />
          <div className='grid gap-1'>
            <p className='font-medium'>Zero latency edge</p>
            <p className='text-text-muted'>
              Deploy across the global edge network in seconds.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
function ImageCard() {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant='outline' size='sm'>
          <RegistryIcon lucide='ImageIcon' aria-hidden='true' />
          View image
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-72 overflow-hidden p-0'>
        <img
          src='static/images/art/9.svg'
          alt='Generated landing page'
          className='aspect-video w-full bg-surface-muted object-cover'
        />
        <div className='grid gap-1 p-3'>
          <p className='font-medium'>Image overview</p>
          <p className='text-text-muted'>
            A visual overview of the generated landing page.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-3'>
      <ProfileCard />
      <FeatureCard />
      <ImageCard />
    </div>
  );
}
