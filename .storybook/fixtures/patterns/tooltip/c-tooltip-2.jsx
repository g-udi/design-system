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
      <div className='mx-auto grid w-full max-w-sm grid-cols-4 gap-2'>
        {sides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant='outline' size='sm' className='w-full capitalize'>
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Add to library</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
