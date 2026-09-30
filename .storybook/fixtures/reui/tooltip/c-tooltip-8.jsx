// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
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
        <div className='flex items-center gap-1'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon-sm' aria-label='Bold'>
                <RegistryIcon lucide='BoldIcon' aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon-sm' aria-label='Italic'>
                <RegistryIcon lucide='ItalicIcon' aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon-sm' aria-label='Underline'>
                <RegistryIcon lucide='UnderlineIcon' aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>
          <div className='flex items-center'>
            <Separator
              orientation='vertical'
              className='mx-1 h-5 leading-none'
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon-sm' aria-label='Image'>
                <RegistryIcon lucide='ImageIcon' aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Image</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
