// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
export function Pattern() {
  return (
    <Field orientation='horizontal' className='w-auto'>
      <Checkbox id='indeterminate' checked='indeterminate' />
      <FieldLabel htmlFor='indeterminate'>Indeterminate state</FieldLabel>
    </Field>
  );
}
