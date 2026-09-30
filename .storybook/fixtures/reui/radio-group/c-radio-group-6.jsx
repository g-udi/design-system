// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
export function Pattern() {
  return (
    <FieldSet className='w-full max-w-xs'>
      <FieldLegend>Battery Level</FieldLegend>
      <FieldDescription>Choose your preferred battery level.</FieldDescription>
      <RadioGroup defaultValue='medium'>
        <Field orientation='horizontal'>
          <RadioGroupItem value='high' id='battery-high' />
          <FieldLabel htmlFor='battery-high'>High</FieldLabel>
        </Field>
        <Field orientation='horizontal'>
          <RadioGroupItem value='medium' id='battery-medium' />
          <FieldLabel htmlFor='battery-medium'>Medium</FieldLabel>
        </Field>
        <Field orientation='horizontal'>
          <RadioGroupItem value='low' id='battery-low' />
          <FieldLabel htmlFor='battery-low'>Low</FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  );
}
