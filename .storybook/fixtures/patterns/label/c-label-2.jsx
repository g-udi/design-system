import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
export function Pattern() {
  return (
    <Field orientation='horizontal' className='mx-auto w-auto'>
      <Checkbox id='label-demo-terms' />
      <Label htmlFor='label-demo-terms'>Accept terms and conditions</Label>
    </Field>
  );
}
