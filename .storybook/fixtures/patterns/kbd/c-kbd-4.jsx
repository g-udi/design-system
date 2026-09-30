import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import {
  Kbd,
  KbdGroup
} from '../../../../src/components/core/Kbd/parts/kbd.jsx';
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
      <div className='mx-auto flex w-full max-w-md flex-wrap items-center justify-center gap-2'>
        <InputGroup className='w-56'>
          <InputGroupAddon>
            <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput aria-label='Search' placeholder='Search…' />
          <InputGroupAddon align='inline-end'>
            <KbdGroup aria-hidden='true'>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </InputGroupAddon>
        </InputGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label='Save' size='icon' variant='outline'>
              <RegistryIcon lucide='SaveIcon' aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent className='pr-1.5'>
            <span className='flex items-center gap-2'>
              Save changes <Kbd>S</Kbd>
            </span>
          </TooltipContent>
        </Tooltip>
        <Button variant='outline'>
          Send
          <Kbd aria-hidden='true'>↵</Kbd>
        </Button>
      </div>
    </TooltipProvider>
  );
}
