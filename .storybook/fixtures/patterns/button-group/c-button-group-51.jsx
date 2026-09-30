import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
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
  plus: <RegistryIcon lucide='PlusIcon' aria-hidden='true' />,
  more: <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />,
  userPlus: <RegistryIcon lucide='UserPlusIcon' aria-hidden='true' />,
  cart: <RegistryIcon lucide='ShoppingCartIcon' aria-hidden='true' />,
  fileText: <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />
};
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline' size='sm' aria-label='More options'>
        {icons.plus}
        New
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='icon-sm' variant='outline' aria-label='More options'>
            {icons.more}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Create</DropdownMenuLabel>
            <DropdownMenuItem>
              {icons.userPlus}
              New Customer
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.cart}
              New Order
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.fileText}
              New Invoice
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
