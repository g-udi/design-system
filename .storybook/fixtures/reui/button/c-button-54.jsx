// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='outline' size='icon' aria-label='Search'>
            <RegistryIcon lucide='SearchIcon' />
          </Button>
        </TooltipTrigger>
        <TooltipContent className='flex items-center gap-3'>
          Search
          <Kbd className='-mr-1'>⌘K</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
