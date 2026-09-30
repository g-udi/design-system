// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupInput
          aria-label='Enter file name'
          placeholder='Enter file name'
        />
        <InputGroupAddon align='inline-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                aria-label='More actions'
                variant='ghost'
                size='icon-xs'
              >
                <RegistryIcon lucide='MoreHorizontalIcon' className='size-4' />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className='text-ui-destructive'>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
