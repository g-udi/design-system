// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
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
            <Toggle variant='outline' aria-label='Pin to sidebar'>
              <RegistryIcon lucide='PinIcon' />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p className='text-sm'>Pin to sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
