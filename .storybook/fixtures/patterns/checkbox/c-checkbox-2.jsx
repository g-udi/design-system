import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
export function Pattern() {
  return (
    <Field orientation='horizontal' data-disabled className='w-auto'>
      <Checkbox id='disabled-2' disabled defaultChecked />
      <FieldLabel htmlFor='disabled-2'>Disabled checkbox</FieldLabel>
    </Field>
  );
}
