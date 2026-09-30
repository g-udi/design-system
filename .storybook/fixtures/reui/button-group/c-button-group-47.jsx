// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupSeparator
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const icons = {
  check: <RegistryIcon lucide='CheckIcon' aria-hidden='true' />,
  chevronDown: <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />,
  checkCircle: <RegistryIcon lucide='CheckCircleIcon' aria-hidden='true' />,
  messageSquare: <RegistryIcon lucide='MessageSquareIcon' aria-hidden='true' />,
  x: <RegistryIcon lucide='XIcon' aria-hidden='true' />
};
export function Pattern() {
  return (
    <ButtonGroup className='**:data-[slot=button]:border-x-0'>
      <Button variant='default'>
        {icons.check}
        Approve
      </Button>
      <ButtonGroupSeparator className='bg-ui-primary-foreground/20' />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='default'
            size='icon'
            aria-label='More approval options'
          >
            {icons.chevronDown}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-52'>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.checkCircle}
              Approve with Conditions
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.messageSquare}
              Request Changes
            </DropdownMenuItem>
            <DropdownMenuItem variant='destructive'>
              {icons.x}
              Reject
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
