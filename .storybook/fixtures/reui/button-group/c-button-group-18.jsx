// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupSeparator
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup className='**:data-[slot=button]:border-r-0'>
      <Button>
        <RegistryIcon
          lucide='PlayIcon'
          aria-hidden='true'
          className='fill-current'
        />
        <span>Execute</span>
      </Button>
      <ButtonGroupSeparator className='bg-ui-primary/72' />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label='Show options'
            size='icon'
            className='border-ui-primary-foreground/20 rounded-l-none border-l'
          >
            <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuItem>Commit & Push</DropdownMenuItem>
          <DropdownMenuItem>Commit & Sync</DropdownMenuItem>
          <DropdownMenuItem>Amend Last Commit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
