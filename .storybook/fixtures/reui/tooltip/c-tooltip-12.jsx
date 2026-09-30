// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className='cursor-not-allowed'>
              <Button variant='outline' disabled>
                Delete Project
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className='text-sm'>You need admin access to delete projects</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
