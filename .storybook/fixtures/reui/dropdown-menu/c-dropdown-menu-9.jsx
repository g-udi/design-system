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
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='w-52'>
            <div className='gap-1.5 flex items-center'>
              <Avatar className='size-5'>
                <AvatarImage
                  src='https://randomuser.me/api/portraits/men/32.jpg'
                  alt='Alex Johnson'
                />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <span className='text-sm font-medium'>Alex Johnson</span>
            </div>

            <RegistryIcon
              lucide='ChevronDownIcon'
              className='ml-auto size-4 opacity-60'
              aria-hidden='true'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className='flex items-center gap-2 py-2'>
              <Avatar className='size-8'>
                <AvatarImage
                  src='https://randomuser.me/api/portraits/men/32.jpg'
                  alt='Alex Johnson'
                />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='text-ui-foreground text-sm font-medium'>
                  Alex Johnson
                </span>
                <span className='text-ui-muted-foreground text-xs font-normal'>
                  alex@example.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon lucide='UserIcon' aria-hidden='true' />
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='CreditCardIcon' aria-hidden='true' />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon lucide='UsersIcon' aria-hidden='true' />
                Team
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
                Invite Members
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon lucide='LifeBuoyIcon' aria-hidden='true' />
                Support
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='BookOpenIcon' aria-hidden='true' />
                Documentation
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'>
              <RegistryIcon lucide='LogOutIcon' aria-hidden='true' />
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
