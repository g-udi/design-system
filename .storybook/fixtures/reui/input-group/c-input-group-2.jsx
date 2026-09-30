// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
export function Pattern() {
  return (
    <Field className='max-w-xs' data-disabled='true'>
      <InputGroup>
        <InputGroupInput
          aria-label='Disabled field'
          placeholder='Disabled field'
          disabled
        />
      </InputGroup>
    </Field>
  );
}
