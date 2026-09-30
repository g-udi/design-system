import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
export function Pattern() {
  return (
    <RadioGroup defaultValue='plus' className='w-full max-w-xs'>
      <FieldLabel htmlFor='plus-plan'>
        <Field orientation='horizontal'>
          <FieldContent>
            <FieldTitle>Plus</FieldTitle>
            <FieldDescription>
              For individuals and small teams.
            </FieldDescription>
          </FieldContent>
          <RadioGroupItem value='plus' id='plus-plan' />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor='pro-plan'>
        <Field orientation='horizontal'>
          <FieldContent>
            <FieldTitle>Pro</FieldTitle>
            <FieldDescription>For growing businesses.</FieldDescription>
          </FieldContent>
          <RadioGroupItem value='pro' id='pro-plan' />
        </Field>
      </FieldLabel>
    </RadioGroup>
  );
}
