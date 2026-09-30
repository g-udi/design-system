import {
  Frame,
  FrameHeader,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='h-54 w-full max-w-xs'>
      <Frame stacked dense spacing='sm' className='w-full'>
        <Collapsible defaultOpen>
          <CollapsibleTrigger className='flex w-full'>
            <FrameHeader className='flex grow flex-row items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <Avatar className='relative size-5'>
                  <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='User' />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className='text-ui-foreground text-sm font-medium'>
                  @alexjohnson
                </span>
              </div>
              <RegistryIcon
                lucide='ChevronRightIcon'
                aria-hidden='true'
                className='text-ui-muted-foreground size-4 transition-transform in-data-[state=open]:rotate-90'
              />
            </FrameHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <FramePanel>
              {/* User profile information */}
              <div className='space-y-2.5'>
                {/* Last activity */}
                <div className='flex items-center gap-2'>
                  <RegistryIcon
                    lucide='MessageSquareIcon'
                    aria-hidden='true'
                    className='text-ui-muted-foreground size-3.5'
                  />
                  <span className='text-ui-muted-foreground text-xs'>
                    Last activity:
                  </span>
                  <span className='text-ui-foreground text-xs font-medium'>
                    2 hours ago
                  </span>
                </div>
                {/* Online since */}
                <div className='flex items-center gap-2'>
                  <RegistryIcon
                    lucide='ClockIcon'
                    aria-hidden='true'
                    className='text-ui-muted-foreground size-3.5'
                  />
                  <span className='text-ui-muted-foreground text-xs'>
                    Online since:
                  </span>
                  <span className='text-ui-foreground text-xs font-medium'>
                    Today, 9:00 AM
                  </span>
                </div>
                {/* Location */}
                <div className='flex items-center gap-2'>
                  <RegistryIcon
                    lucide='MapPinIcon'
                    aria-hidden='true'
                    className='text-ui-muted-foreground size-3.5'
                  />
                  <span className='text-ui-muted-foreground text-xs'>
                    Location:
                  </span>
                  <div className='flex items-center gap-1.5'>
                    <span className='text-ui-foreground text-xs font-medium'>
                      Canada
                    </span>
                    <img
                      src={`https://flagcdn.com/ca.svg`}
                      alt='Canada'
                      className='size-4 shrink-0 rounded-full border object-cover'
                    />
                  </div>
                </div>
              </div>
            </FramePanel>
          </CollapsibleContent>
        </Collapsible>
      </Frame>
    </div>
  );
}
