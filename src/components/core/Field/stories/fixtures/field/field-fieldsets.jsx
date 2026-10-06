import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import {
  FieldRoot as Field,
  FieldContent,
  FieldDescriptionPrimitive as FieldDescription,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle
} from '@gaudi/design-system/core/Field';
import {
  RadioGroupRoot as RadioGroup,
  RadioGroupItem
} from '@gaudi/design-system/core/RadioGroup';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';

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
