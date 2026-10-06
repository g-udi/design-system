import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { KbdRoot as Kbd, KbdGroup } from '@gaudi/design-system/core/Kbd';
import { TooltipRoot as Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const Count = ({ children }) => (
  <span className='relative ms-1 px-2.5 text-xs font-medium tabular-nums before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-current before:opacity-40'>
    {children}
  </span>
);

export function Pattern() {
  return (
    <TooltipProvider>
      <div className='mx-auto flex w-full max-w-2xl flex-col gap-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <Button className='pe-0' aria-label='Like (456)'>
            <RegistryIcon lucide='ThumbsUpIcon' aria-hidden='true' />Like<Count>456</Count>
          </Button>
          <Button className='pe-0' variant='outline' aria-label='Star (589)'>
            <RegistryIcon lucide='StarIcon' aria-hidden='true' />Star<Count>589</Count>
          </Button>
          <Button variant='outline' aria-label='Messages (12)'>
            Messages
            <Badge variant='destructive-outline' size='sm' aria-hidden='true'>12</Badge>
          </Button>
          <Button aria-label='Updates (new)'>
            Updates
            <Badge variant='success' size='xs' aria-hidden='true'>New</Badge>
          </Button>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Button variant='outline' className='relative' aria-label='Inbox (8 unread)'>
            <RegistryIcon lucide='MailIcon' aria-hidden='true' />Inbox
            <Badge variant='destructive' size='sm' className='absolute -top-1.5 -right-2 px-1' aria-hidden='true'>8</Badge>
          </Button>
          <Button size='icon' variant='outline' className='relative' aria-label='Notifications (8)'>
            <RegistryIcon lucide='BellIcon' aria-hidden='true' />
            <Badge variant='destructive' size='xs' className='absolute -top-1 -right-1 px-1' aria-hidden='true'>8</Badge>
          </Button>
          <Button variant='outline' aria-label='Deploy (live)'>
            Live
            <span aria-hidden='true' className='relative flex size-2'>
              <span className='absolute inset-0 animate-ping rounded-full bg-success opacity-60' />
              <span className='relative size-2 rounded-full bg-success' />
            </span>
          </Button>
          <Button variant='outline' aria-label='Search (Command K)'>
            <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
            Search
            <KbdGroup aria-hidden='true'><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' size='icon' aria-label='Command palette'>
                <RegistryIcon lucide='CommandIcon' aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='flex items-center gap-2'>
              Command palette
              <Kbd>⌘P</Kbd>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
