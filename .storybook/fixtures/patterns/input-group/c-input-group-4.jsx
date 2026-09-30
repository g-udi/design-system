import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupAddon>
          <RegistryIcon lucide='SearchIcon' />
        </InputGroupAddon>
        <InputGroupInput aria-label='Search...' placeholder='Search...' />
      </InputGroup>
    </Field>
  );
}
