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
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupInput aria-label='username' placeholder='username' />
        <InputGroupAddon align='inline-end'>
          <InputGroupText>@gmail.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
