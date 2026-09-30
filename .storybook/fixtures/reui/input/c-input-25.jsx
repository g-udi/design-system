// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor='custom-focus'>Custom Focus</FieldLabel>
      <Input
        id='custom-focus'
        className='focus-visible:border-emerald-500 focus-visible:ring-emerald-500/50'
        placeholder='Green focus ring'
      />
    </Field>
  );
}
