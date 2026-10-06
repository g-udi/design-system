import {
  FieldRoot as Field,
  FieldContent,
  FieldDescriptionPrimitive as FieldDescription,
  FieldErrorPrimitive as FieldError,
  FieldLabelPrimitive as FieldLabel,
  FieldLegend,
  FieldSet
} from '@gaudi/design-system/core/Field';
import {
  RadioGroupRoot as RadioGroup,
  RadioGroupItem
} from '@gaudi/design-system/core/RadioGroup';

const densities = [
  { value: 'default', label: 'Default', description: 'Standard spacing for most use cases.' },
  { value: 'comfortable', label: 'Comfortable', description: 'More space between elements.' },
  { value: 'compact', label: 'Compact', description: 'Available on the Pro plan.', disabled: true }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xs gap-6'>
      <FieldSet className='gap-3'>
        <FieldLegend>Density</FieldLegend>
        <FieldDescription>Applies to every table in this workspace.</FieldDescription>
        <RadioGroup defaultValue='comfortable' aria-label='Density'>
          {densities.map((item) => (
            <Field key={item.value} orientation='horizontal' data-disabled={item.disabled || undefined}>
              <RadioGroupItem value={item.value} id={`density-${item.value}`} disabled={item.disabled} />
              <FieldContent>
                <FieldLabel htmlFor={`density-${item.value}`}>{item.label}</FieldLabel>
                <FieldDescription>{item.description}</FieldDescription>
              </FieldContent>
            </Field>
          ))}
        </RadioGroup>
      </FieldSet>
      <FieldSet className='gap-3' data-invalid>
        <FieldLegend variant='label'>Contact method</FieldLegend>
        <RadioGroup aria-label='Contact method' aria-describedby='contact-error'>
          <Field orientation='horizontal' data-invalid>
            <RadioGroupItem value='email' id='contact-email' aria-invalid />
            <FieldLabel htmlFor='contact-email'>Email only</FieldLabel>
          </Field>
          <Field orientation='horizontal' data-invalid>
            <RadioGroupItem value='sms' id='contact-sms' aria-invalid />
            <FieldLabel htmlFor='contact-sms'>SMS only</FieldLabel>
          </Field>
        </RadioGroup>
        <FieldError id='contact-error'>Choose how we should reach you.</FieldError>
      </FieldSet>
    </div>
  );
}
