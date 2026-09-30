// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
export function Pattern() {
  return (
    <Field className='w-auto'>
      <FieldLabel>Notification Settings</FieldLabel>
      <Field orientation='horizontal'>
        <Switch id='sg-email' defaultChecked />
        <FieldLabel htmlFor='sg-email'>Email notifications</FieldLabel>
      </Field>
      <Field orientation='horizontal'>
        <Switch id='sg-sms' />
        <FieldLabel htmlFor='sg-sms'>SMS notifications</FieldLabel>
      </Field>
      <Field orientation='horizontal'>
        <Switch id='sg-push' defaultChecked />
        <FieldLabel htmlFor='sg-push'>Push notifications</FieldLabel>
      </Field>
    </Field>
  );
}
