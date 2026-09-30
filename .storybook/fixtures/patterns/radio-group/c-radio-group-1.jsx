import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
export function Pattern() {
  return (
    <RadioGroup defaultValue='comfortable' className='w-fit'>
      <Field orientation='horizontal'>
        <RadioGroupItem value='default' id='r1' />
        <FieldLabel htmlFor='r1'>Default</FieldLabel>
      </Field>
      <Field orientation='horizontal'>
        <RadioGroupItem value='comfortable' id='r2' />
        <FieldLabel htmlFor='r2'>Comfortable</FieldLabel>
      </Field>
      <Field orientation='horizontal'>
        <RadioGroupItem value='compact' id='r3' />
        <FieldLabel htmlFor='r3'>Compact</FieldLabel>
      </Field>
    </RadioGroup>
  );
}
