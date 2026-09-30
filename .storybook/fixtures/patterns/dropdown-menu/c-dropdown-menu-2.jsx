import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
const sides = ['left', 'top', 'bottom', 'right'];
export function Pattern() {
  return (
    <div className='grid grid-cols-2 gap-2'>
      {sides.map((side) => (
        <DropdownMenu key={side}>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-full'>
              {side.replace('-', ' ').charAt(0).toUpperCase() +
                side.replace('-', ' ').slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={side}>
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
}
