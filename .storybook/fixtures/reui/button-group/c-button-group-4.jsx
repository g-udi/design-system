// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline'>Update</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label='Show options' variant='outline' size='icon'>
            <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-36'>
          <DropdownMenuItem>Production</DropdownMenuItem>
          <DropdownMenuItem>Staging</DropdownMenuItem>
          <DropdownMenuItem>Development</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
