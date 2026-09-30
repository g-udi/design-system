import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <Label htmlFor='label-optional'>
        Phone number
        <span className='text-ui-muted-foreground'>(optional)</span>
      </Label>
      <Input id='label-optional' type='tel' placeholder='+1 (555) 000-0000' />
    </Field>
  );
}
