import { default as Button } from '@gaudi/design-system/core/Button';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className='cursor-not-allowed' tabIndex={0}>
              <Button variant='outline' disabled>
                Delete Project
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className='text-sm'>Only editors can delete published posts</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
