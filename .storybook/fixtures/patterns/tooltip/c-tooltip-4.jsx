import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='outline' size='icon-sm' aria-label='Save'>
              <RegistryIcon lucide='SaveIcon' />
            </Button>
          </TooltipTrigger>
          <TooltipContent className='pr-1.5'>
            <div className='flex items-center gap-2 text-sm'>
              Save Changes <Kbd>S</Kbd>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
