// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup className='max-w-xs'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' aria-label='Filter'>
            <RegistryIcon lucide='ListFilterIcon' aria-hidden='true' />
            Filter
            <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-40'>
          <DropdownMenuItem>All Records</DropdownMenuItem>
          <DropdownMenuItem>Recent</DropdownMenuItem>
          <DropdownMenuItem>Archived</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Input aria-label='Filter records...' placeholder='Filter records...' />
      <Button aria-label='Close' variant='outline' size='icon'>
        <RegistryIcon lucide='XIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
