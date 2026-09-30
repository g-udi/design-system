// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='rounded-control h-8 gap-1.5 pr-2.5 pl-1'
        >
          <Avatar className='border-ui-background size-6 border'>
            <AvatarImage
              src='https://randomuser.me/api/portraits/women/65.jpg'
              alt='Liam Thompson'
            />
            <AvatarFallback>LT</AvatarFallback>
          </Avatar>
          <span className='text-xs font-medium'>Liam Thompson</span>
          <RegistryIcon
            lucide='ChevronsUpDownIcon'
            className='size-3.5 opacity-60'
            aria-hidden='true'
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-44' align='center' sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Management</DropdownMenuLabel>
          <DropdownMenuItem>
            <RegistryIcon lucide='UserIcon' aria-hidden='true' />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <RegistryIcon lucide='UserIcon' aria-hidden='true' />
            <span>Teams</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            <span>Invite</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive'>
          <RegistryIcon lucide='LogOutIcon' aria-hidden='true' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
