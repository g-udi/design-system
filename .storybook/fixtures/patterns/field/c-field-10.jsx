import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';

const channels = [
  { id: 'push', title: 'Push notifications', description: 'Alerts sent to your device in real time.', checked: true },
  { id: 'digest', title: 'Email digest', description: 'A daily summary sent to your inbox.', checked: true },
  { id: 'sms', title: 'SMS alerts', description: 'Text messages for critical notifications only.', checked: false }
];
const permissions = [
  { id: 'read', title: 'Read', description: 'View resources and data.', checked: true },
  { id: 'write', title: 'Write', description: 'Create and edit resources.', checked: true },
  { id: 'delete', title: 'Delete', description: 'Permanently remove resources.', checked: false },
  { id: 'admin', title: 'Admin', description: 'Only available to workspace owners.', checked: false, disabled: true }
];

export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs'>
      <FieldGroup className='gap-4'>
        <FieldSet className='gap-3'>
          <FieldLegend variant='label'>Notification channels</FieldLegend>
          <FieldGroup className='gap-3'>
            {channels.map((item) => (
              <Field key={item.id} orientation='horizontal'>
                <FieldContent>
                  <FieldTitle>{item.title}</FieldTitle>
                  <FieldDescription>{item.description}</FieldDescription>
                </FieldContent>
                <Switch aria-label={item.title} id={`channel-${item.id}`} defaultChecked={item.checked} />
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet className='gap-3'>
          <FieldLegend variant='label'>Access permissions</FieldLegend>
          <FieldDescription>Configure what this role can access.</FieldDescription>
          <FieldGroup className='gap-3'>
            {permissions.map((item) => (
              <Field key={item.id} orientation='horizontal'>
                <Checkbox aria-label={item.title} id={`perm-${item.id}`} defaultChecked={item.checked} disabled={item.disabled} />
                <FieldContent>
                  <FieldTitle>{item.title}</FieldTitle>
                  <FieldDescription>{item.description}</FieldDescription>
                </FieldContent>
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet className='gap-3'>
          <FieldLegend variant='label'>Profile privacy</FieldLegend>
          <RadioGroup defaultValue='public' aria-label='Profile privacy'>
            <Field orientation='horizontal'>
              <RadioGroupItem value='public' id='privacy-public' />
              <FieldLabel htmlFor='privacy-public' className='font-normal'>Public, visible to everyone</FieldLabel>
            </Field>
            <Field orientation='horizontal'>
              <RadioGroupItem value='private' id='privacy-private' />
              <FieldLabel htmlFor='privacy-private' className='font-normal'>Private, only visible to you</FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  );
}
