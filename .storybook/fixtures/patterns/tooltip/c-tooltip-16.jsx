import { default as Button } from '../../../../src/components/core/Button/index.js';
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
            <Button variant='ghost' size='icon' aria-label='Notifications'>
              <div className='relative'>
                <RegistryIcon lucide='BellIcon' />
                <span className='bg-ui-destructive absolute -top-1 -right-1 block size-2 rounded-full' />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm font-medium'>3 new notifications</p>
              <a
                href='#'
                className='text-xs font-medium underline underline-offset-2'
              >
                View all &rarr;
              </a>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
