import { default as Button } from '@gaudi/design-system/core/Button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import {
  KbdRoot as Kbd,
  KbdGroup
} from '@gaudi/design-system/core/Kbd';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
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
