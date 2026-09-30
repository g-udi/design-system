import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline'>
        <RegistryIcon lucide='StarIcon' aria-hidden='true' />
        <span>Star</span>
        <Badge variant='secondary'>2.4k</Badge>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon'>
            <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
            <span className='sr-only'>Toggle dropdown</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-40'>
          <DropdownMenuItem>
            <RegistryIcon lucide='EyeIcon' aria-hidden='true' />
            Watch
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='GitForkIcon' aria-hidden='true' />
            Fork
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='ListPlusIcon' aria-hidden='true' />
            Add to list
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <RegistryIcon lucide='Share2Icon' aria-hidden='true' />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='BellIcon' aria-hidden='true' />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <RegistryIcon lucide='FlagIcon' aria-hidden='true' />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
