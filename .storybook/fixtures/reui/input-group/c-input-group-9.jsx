// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '../../../../src/components/core/Input/parts/input-group.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label='0.00' type='number' placeholder='0.00' />
        <InputGroupAddon align='inline-end'>
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
