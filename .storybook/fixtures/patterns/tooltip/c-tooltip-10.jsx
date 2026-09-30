import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
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
            <Button variant='outline' size='icon' aria-label='Pro feature'>
              <RegistryIcon lucide='LockIcon' />
            </Button>
          </TooltipTrigger>
          <TooltipContent className='max-w-64 p-3'>
            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-semibold'>
                  Advanced Analytics
                </span>
                <Badge variant='success' size='sm'>
                  Pro
                </Badge>
              </div>
              <p className='text-xs opacity-80'>
                Unlock detailed insights, custom reports, and real-time
                dashboards.
              </p>
              <Button size='sm' className='border-ui-border/40 border'>
                Upgrade to Pro
                <RegistryIcon lucide='ArrowRightIcon' />
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
