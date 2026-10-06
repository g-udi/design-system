import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
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
              src='/avatars/person-23.svg'
              alt='Quentin Hale'
            />
            <AvatarFallback>QH</AvatarFallback>
          </Avatar>
          <span className='text-xs font-medium'>Quentin Hale</span>
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
