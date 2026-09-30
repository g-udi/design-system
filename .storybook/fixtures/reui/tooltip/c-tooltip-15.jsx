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
        <Tooltip>
          <TooltipTrigger className='text-ui-muted-foreground hover:text-ui-foreground cursor-pointer transition-colors'>
            <div className='flex items-center gap-1.5 text-sm'>
              <RegistryIcon
                lucide='TagIcon'
                className='size-3.5'
                aria-hidden='true'
              />
              3 labels
            </div>
          </TooltipTrigger>
          <TooltipContent className='p-3'>
            <div className='flex flex-col gap-2'>
              <span className='font-medium'>Labels</span>
              <div className='flex items-center gap-1.5'>
                <Badge variant='destructive' size='xs'>
                  Bug
                </Badge>
                <Badge variant='info' size='xs'>
                  Frontend
                </Badge>
                <Badge variant='warning' size='xs'>
                  High Priority
                </Badge>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
