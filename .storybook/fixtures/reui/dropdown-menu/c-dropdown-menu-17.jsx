// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const icons = {
  bell: <RegistryIcon lucide='BellIcon' aria-hidden='true' />,
  check: <RegistryIcon lucide='CheckIcon' aria-hidden='true' />
};
export function Pattern() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label='Notifications' variant='ghost' size='icon'>
          {icons.bell}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuItem>
            <span className='flex-1'>New message from Alex</span>
            {icons.check}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className='flex-1'>Document approved</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className='flex-1'>Pipeline stage updated</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
