import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
const sides = ['top', 'right', 'bottom', 'left'];
export function Pattern() {
  return (
    <TooltipProvider>
      <div className='grid max-w-xs grid-cols-2 gap-2'>
        {sides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant='outline' className='w-full'>
                {side.replace('-', ' ')[0].toUpperCase() +
                  side.replace('-', ' ').slice(1)}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>
              <p className='text-sm'>Add to library</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
