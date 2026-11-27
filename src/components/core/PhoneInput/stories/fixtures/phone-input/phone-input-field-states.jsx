import { PhoneInput } from '@gaudi/design-system/core/PhoneInput';
import { FieldRoot as Field, FieldLabelPrimitive as Label, FieldDescriptionPrimitive as FieldDescription, FieldErrorPrimitive as FieldError } from '@gaudi/design-system/core/Field';

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
      <Field>
        <Label htmlFor='phone-empty'>Phone number</Label>
        <PhoneInput id='phone-empty' aria-describedby='phone-empty-description' defaultCountry='NL' placeholder='Enter phone number' />
        <FieldDescription id='phone-empty-description'>Empty, Netherlands preselected</FieldDescription>
      </Field>
      <Field>
        <Label htmlFor='phone-readonly'>Office line</Label>
        <PhoneInput id='phone-readonly' aria-describedby='phone-readonly-description' readOnly value='+12125551234' />
        <FieldDescription id='phone-readonly-description'>Read-only</FieldDescription>
      </Field>
      <Field>
        <Label htmlFor='phone-disabled'>Fax</Label>
        <PhoneInput id='phone-disabled' aria-describedby='phone-disabled-description' disabled defaultCountry='FR' value='+33612345678' />
        <FieldDescription id='phone-disabled-description'>Disabled</FieldDescription>
      </Field>
      <Field>
        <Label htmlFor='phone-error'>Emergency contact</Label>
        <PhoneInput
          id='phone-error'
          aria-invalid='true'
          aria-describedby='phone-error-message'
          placeholder='Enter phone number'
        />
        <FieldError id='phone-error-message'>
          Enter a valid phone number.
        </FieldError>
      </Field>
    </div>
  );
}
