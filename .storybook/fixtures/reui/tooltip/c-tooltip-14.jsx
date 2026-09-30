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
            <div className='flex items-center gap-1'>
              <RegistryIcon
                lucide='FileTextIcon'
                className='size-4'
                aria-hidden='true'
              />
              <span className='text-sm'>report-q4.pdf</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className='p-3'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <div className='bg-ui-muted rounded-md flex size-8 shrink-0 items-center justify-center'>
                  <RegistryIcon
                    lucide='FileTextIcon'
                    className='text-ui-muted-foreground size-4'
                    aria-hidden='true'
                  />
                </div>
                <div className='flex flex-col gap-0.5'>
                  <span className='font-medium'>report-q4.pdf</span>
                  <span className='opacity-80'>
                    2.4 MB &middot; Uploaded 3 days ago
                  </span>
                </div>
              </div>
              <div className='flex items-center gap-1.5'>
                <Badge variant='info' size='xs'>
                  PDF
                </Badge>
                <Badge variant='success' size='xs'>
                  Verified
                </Badge>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
