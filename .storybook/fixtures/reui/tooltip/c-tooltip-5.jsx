// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
            <Button variant='outline' size='icon' aria-label='Notifications'>
              <div className='relative'>
                <RegistryIcon lucide='InfoIcon' />
                <Badge
                  variant='destructive'
                  size='xs'
                  className='absolute -top-3.5 -right-3.5'
                >
                  3
                </Badge>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent className='p-3'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between gap-2'>
                <span className='font-medium'>Notifications</span>
                <Badge variant='destructive' size='xs'>
                  3 new
                </Badge>
              </div>
              <div className='flex flex-col gap-1 opacity-80'>
                <p>• Sarah commented on your PR</p>
                <p>• Build #421 completed</p>
                <p>• New team member joined</p>
              </div>
              <a
                href='#'
                className='flex items-center gap-1 font-medium underline underline-offset-2'
              >
                View all
                <RegistryIcon lucide='ArrowRightIcon' className='size-3.5' />
              </a>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
