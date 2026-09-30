// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../../../../src/components/core/Popover/parts/hover-card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex min-h-[100px] items-center justify-center'>
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className='flex cursor-pointer items-center gap-2'>
            <Avatar className='size-8'>
              <AvatarImage
                src='static/images/art/11.svg'
                alt='Elena Soroka'
              />
              <AvatarFallback>ES</AvatarFallback>
            </Avatar>
            <div>
              <p className='text-sm font-medium hover:underline'>
                Elena Soroka
              </p>
              <p className='text-ui-muted-foreground text-xs'>@e.soroka</p>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className='w-64'>
          <div className='flex space-x-2'>
            <Avatar className='size-10 shrink-0'>
              <AvatarImage
                src='static/images/art/11.svg'
                alt='Elena Soroka'
              />
              <AvatarFallback>ES</AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
              <div>
                <p className='text-sm font-medium hover:underline'>
                  Elena Soroka
                </p>
                <p className='text-ui-muted-foreground text-xs'>@e.soroka</p>
              </div>
              <p className='text-ui-foreground'>
                Lead Product Designer at Vibe.
              </p>
              <div className='flex items-center gap-1'>
                <RegistryIcon
                  lucide='CalendarIcon'
                  className='size-3.5 opacity-60'
                />
                <span className='text-ui-muted-foreground text-xs leading-none'>
                  Joined December 2023
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
