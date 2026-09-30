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
          <Button variant='outline'>Hover Me</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className='flex flex-col gap-1'>
            <h4 className='leading-none font-medium'>Hover Card</h4>
            <p className='text-ui-muted-foreground'>
              A basic hover card that appears when you hover over the trigger.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
