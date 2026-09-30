import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupText
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup className='max-w-full overflow-x-auto'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='gap-2'>
            <RegistryIcon lucide='GitMergeIcon' aria-hidden='true' />
            <span>main</span>
            <RegistryIcon
              lucide='ChevronDownIcon'
              aria-hidden='true'
              className='size-3.5 opacity-60'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-48'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
            <DropdownMenuItem>
              <RegistryIcon lucide='GitBranchIcon' aria-hidden='true' />
              <span>main</span>
              <RegistryIcon
                lucide='CheckIcon'
                aria-hidden='true'
                className='text-ui-primary ml-auto size-3.5'
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='GitBranchIcon' aria-hidden='true' />
              <span>develop</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='GitBranchIcon' aria-hidden='true' />
              <span>feature/auth</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ButtonGroupText className='bg-transparent'>
        <div className='size-1.5 animate-pulse rounded-full bg-green-600' />
        <span>Production</span>
      </ButtonGroupText>

      <Button aria-label='Refresh' variant='outline' size='icon'>
        <RegistryIcon lucide='RefreshCwIcon' aria-hidden='true' />
      </Button>

      <Button aria-label='Open link' variant='outline' size='icon'>
        <RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
