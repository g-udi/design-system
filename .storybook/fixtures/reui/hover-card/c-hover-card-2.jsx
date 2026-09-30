// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../../../../src/components/core/Popover/parts/hover-card.jsx';
const sides = ['top', 'right', 'bottom', 'left'];
export function Pattern() {
  return (
    <div className='grid grid-cols-2 gap-2'>
      {sides.map((side) => (
        <HoverCard key={side} openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant='outline' className='flex-1 capitalize'>
              {side.replace('-', ' ')}
            </Button>
          </HoverCardTrigger>

          <HoverCardContent side={side}>
            <div className='flex flex-col gap-1'>
              <h4 className='font-medium'>Hover Card</h4>
              <p className='text-ui-muted-foreground'>
                This hover card appears on the {side.replace('-', ' ')} side of
                the trigger.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}
