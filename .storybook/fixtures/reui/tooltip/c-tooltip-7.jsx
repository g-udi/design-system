// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
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
        <p className='text-sm'>
          Verified domain{' '}
          <Tooltip>
            <TooltipTrigger className='text-ui-muted-foreground align-middle'>
              <RegistryIcon
                lucide='BadgeCheckIcon'
                className='size-4 text-emerald-600'
                aria-hidden='true'
              />
            </TooltipTrigger>
            <TooltipContent>
              <div className='flex items-center gap-2'>
                <Badge variant='success' size='sm'>
                  Verified
                </Badge>
                <p>Domain ownership has been confirmed.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </p>
      </TooltipProvider>
    </div>
  );
}
