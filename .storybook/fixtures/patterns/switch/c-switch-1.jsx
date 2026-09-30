import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Field orientation='horizontal'>
        <Switch id='switch-basic' />
        <FieldLabel htmlFor='switch-basic'>Airplane Mode</FieldLabel>
      </Field>
    </div>
  );
}
