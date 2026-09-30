// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
            <Button variant='ghost' size='icon' aria-label='More information'>
              <RegistryIcon lucide='InfoIcon' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className='text-center text-sm'>
              Additional information and help context.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
