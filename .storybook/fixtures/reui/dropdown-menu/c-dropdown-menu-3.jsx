// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='w-fit'>
            Options
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RegistryIcon lucide='UserIcon' />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='CreditCardIcon' />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='SettingsIcon' />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>
            <RegistryIcon lucide='LogOutIcon' />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
