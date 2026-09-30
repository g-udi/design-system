// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <InputGroup>
        <InputGroupInput
          aria-label='Search documentation...'
          placeholder='Search documentation...'
        />
        <InputGroupAddon align='inline-end'>
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
