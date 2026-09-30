// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor='search-loading'>Searching</FieldLabel>
      <InputGroup id='search-loading'>
        <InputGroupInput
          aria-label='Search records…'
          placeholder='Search records…'
        />
        <InputGroupAddon>
          <Spinner className='size-4' />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
