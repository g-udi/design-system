import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import {
  FieldRoot as Field,
  FieldContent,
  FieldDescriptionPrimitive as FieldDescription,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xs gap-3'>
      <Field orientation='horizontal'>
        <Checkbox id='cb-basic' />
        <FieldLabel htmlFor='cb-basic'>Remember this device</FieldLabel>
      </Field>
      <Field orientation='horizontal'>
        <Checkbox id='cb-terms' defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor='cb-terms'>Accept terms and conditions</FieldLabel>
          <FieldDescription>You can review the terms at any time in settings.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation='horizontal'>
        <Checkbox id='cb-indeterminate' checked='indeterminate' />
        <FieldLabel htmlFor='cb-indeterminate'>Some files selected</FieldLabel>
      </Field>
      <Field orientation='horizontal' data-disabled>
        <Checkbox id='cb-disabled' disabled defaultChecked />
        <FieldLabel htmlFor='cb-disabled'>Managed by your admin</FieldLabel>
      </Field>
      <Field orientation='horizontal' data-invalid>
        <Checkbox id='cb-invalid' aria-invalid />
        <FieldLabel htmlFor='cb-invalid'>Confirm you are over 18</FieldLabel>
      </Field>
    </div>
  );
}
