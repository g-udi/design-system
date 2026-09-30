import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../../../../src/components/core/Popover/parts/hover-card.jsx';
const sides = ['top', 'right', 'bottom', 'left'];
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-sm grid-cols-4 gap-2'>
      {sides.map((side) => (
        <HoverCard key={side} openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant='outline' size='sm' className='w-full capitalize'>
              {side}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side={side} className='w-56'>
            <div className='flex flex-col gap-1'>
              <p className='font-medium'>Hover card</p>
              <p className='text-text-muted'>
                Opens on the {side} after a short hover or on focus.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}
