// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <Label htmlFor='label-required'>
        Email address
        <span className='text-ui-destructive'>*</span>
      </Label>
      <Input
        id='label-required'
        type='email'
        placeholder='you@example.com'
        required
      />
    </Field>
  );
}
