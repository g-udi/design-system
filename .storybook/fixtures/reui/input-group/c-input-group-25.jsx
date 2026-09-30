// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupAddon>
          <RegistryIcon
            lucide='SearchIcon'
            className='text-ui-muted-foreground size-4'
          />
        </InputGroupAddon>
        <InputGroupInput
          aria-label='Search logs...'
          placeholder='Search logs...'
        />
        <InputGroupAddon align='inline-end'>
          <InputGroupText className='text-ui-muted-foreground text-xs'>
            12 results
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
