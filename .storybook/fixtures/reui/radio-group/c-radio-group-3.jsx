// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldContent,
  FieldDescription,
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
        <RadioGroupItem value='default' id='desc-r1' />
        <FieldContent>
          <FieldLabel htmlFor='desc-r1'>Default</FieldLabel>
          <FieldDescription>
            Standard spacing for most use cases.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation='horizontal'>
        <RadioGroupItem value='comfortable' id='desc-r2' />
        <FieldContent>
          <FieldLabel htmlFor='desc-r2'>Comfortable</FieldLabel>
          <FieldDescription>More space between elements.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation='horizontal'>
        <RadioGroupItem value='compact' id='desc-r3' />
        <FieldContent>
          <FieldLabel htmlFor='desc-r3'>Compact</FieldLabel>
          <FieldDescription>
            Minimal spacing for dense layouts.
          </FieldDescription>
        </FieldContent>
      </Field>
    </RadioGroup>
  );
}
