// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor='subtle-bg'>Subtle Background</FieldLabel>
      <Input
        id='subtle-bg'
        className='bg-ui-muted focus-visible:bg-ui-muted hover:bg-ui-muted transition-colors duration-300'
        placeholder='Enter text...'
      />
    </Field>
  );
}
