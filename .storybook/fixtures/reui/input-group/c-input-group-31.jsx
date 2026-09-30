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
        <InputGroupAddon className='pr-0 pl-3'>
          <InputGroupText className='text-ui-muted-foreground'>
            €
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-label='0.00'
          placeholder='0.00'
          className='border-ui-border border-r'
        />
        <InputGroupAddon align='inline-end' className='pl-2'>
          <InputGroupText>EUR</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
