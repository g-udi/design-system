import { default as Button } from '@gaudi/design-system/core/Button';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
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
