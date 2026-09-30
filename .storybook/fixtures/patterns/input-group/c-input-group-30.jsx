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
        <InputGroupAddon className='pr-2'>
          <InputGroupText>€</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-label='0.00'
          placeholder='0.00'
          className='border-ui-border border-x'
        />
        <InputGroupAddon align='inline-end' className='pl-2'>
          <InputGroupText>EUR</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
