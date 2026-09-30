// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldDescription,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <FieldLabel htmlFor='input-demo-username'>Username</FieldLabel>
      <Input
        id='input-demo-username'
        type='text'
        placeholder='Enter your username'
      />
      <FieldDescription>
        Choose a unique username for your account.
      </FieldDescription>
    </Field>
  );
}
