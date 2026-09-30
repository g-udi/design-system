import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
const sides = ['top', 'right', 'bottom', 'left'];
const aligns = ['start', 'center', 'end'];
const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
function Placement({ side, align, label }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='w-full'>
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className='w-36'>
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
// Each trigger opens the same menu on another side or alignment.
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-md gap-3'>
      <div className='grid gap-2'>
        <span className='text-text-muted text-xs font-medium'>Side</span>
        <div className='grid grid-cols-4 gap-2'>
          {sides.map((side) => (
            <Placement key={side} side={side} label={capitalize(side)} />
          ))}
        </div>
      </div>
      <div className='grid gap-2'>
        <span className='text-text-muted text-xs font-medium'>Align</span>
        <div className='grid grid-cols-3 gap-2'>
          {aligns.map((align) => (
            <Placement key={align} side='bottom' align={align} label={capitalize(align)} />
          ))}
        </div>
      </div>
    </div>
  );
}
