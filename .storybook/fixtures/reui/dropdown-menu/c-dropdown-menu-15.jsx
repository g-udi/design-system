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
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const user = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  initials: 'AJ'
};
export function Pattern() {
  return (
    <div className='flex shrink-0 items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='sm'>
            <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40' sideOffset={12}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Create</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon
                  lucide='UserPlusIcon'
                  className='size-4 opacity-60'
                  aria-hidden='true'
                />
                New Customer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon
                  lucide='ShoppingCartIcon'
                  className='size-4 opacity-60'
                  aria-hidden='true'
                />
                New Order
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon
                  lucide='FileTextIcon'
                  className='size-4 opacity-60'
                  aria-hidden='true'
                />
                New Invoice
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon
                lucide='UploadIcon'
                className='size-4 opacity-60'
                aria-hidden='true'
              />
              Import Data
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation='vertical' className='my-auto h-4' />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type='button' aria-label='Account menu'>
            <Avatar className='size-6'>
              <AvatarImage
                src='https://randomuser.me/api/portraits/men/32.jpg'
                alt={user.name}
              />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' sideOffset={12} className='w-56'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className='flex flex-col'>
                <span className='text-ui-foreground text-sm'>{user.name}</span>
                <span className='text-ui-muted-foreground text-xs'>
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon
                  lucide='UserIcon'
                  className='size-4 opacity-60'
                  aria-hidden='true'
                />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon
                  lucide='CreditCardIcon'
                  className='size-4 opacity-60'
                  aria-hidden='true'
                />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon
                  lucide='SettingsIcon'
                  className='size-4 opacity-60'
                  aria-hidden='true'
                />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'>
              <RegistryIcon lucide='LogOutIcon' aria-hidden='true' />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
