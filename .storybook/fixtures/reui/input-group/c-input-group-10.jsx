// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <InputGroup>
        <InputGroupInput aria-label='Query...' placeholder='Query...' />
        <InputGroupAddon align='inline-end'>
          <InputGroupButton>Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
