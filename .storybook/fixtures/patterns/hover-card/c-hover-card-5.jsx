import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../../../../src/components/core/Popover/parts/hover-card.jsx';
export function Pattern() {
  return (
    <div className='flex min-h-[100px] items-center justify-center'>
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant='outline'>View Image</Button>
        </HoverCardTrigger>
        <HoverCardContent className='w-[320px] overflow-hidden p-0'>
          <img
            src='static/images/art/9.svg'
            alt='Card Image'
            className='aspect-video w-full object-cover'
          />
          <div className='space-y-1 p-3'>
            <p className='font-medium'>Image Overview</p>
            <p className='text-ui-muted-foreground leading-relaxed'>
              Visual overview of generated landing page.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
