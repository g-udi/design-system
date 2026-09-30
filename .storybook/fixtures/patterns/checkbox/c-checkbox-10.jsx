import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const permissions = [
  { id: 'perm-read', label: 'Read', checked: true },
  { id: 'perm-write', label: 'Write', checked: false },
  { id: 'perm-delete', label: 'Delete', checked: true }
];
const channels = [
  { id: 'ch-push', icon: 'LaptopIcon', label: 'Push notifications', checked: true },
  { id: 'ch-email', icon: 'MailIcon', label: 'Email notifications', checked: false },
  { id: 'ch-sms', icon: 'SmartphoneIcon', label: 'SMS notifications', checked: false }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xs gap-3'>
      {/* Inline: short options on one line. */}
      <FieldSet className='gap-2'>
        <FieldLegend variant='label'>Permissions</FieldLegend>
        <div className='flex flex-wrap items-center gap-4'>
          {permissions.map((item) => (
            <Field key={item.id} orientation='horizontal' className='w-auto'>
              <Checkbox id={item.id} defaultChecked={item.checked} />
              <FieldLabel htmlFor={item.id}>{item.label}</FieldLabel>
            </Field>
          ))}
        </div>
      </FieldSet>
      {/* Stacked in a frame: each row is one click target, with a leading icon. */}
      <Frame spacing='sm'>
        <FrameHeader>
          <FrameTitle>Notification settings</FrameTitle>
        </FrameHeader>
        <FramePanel className='overflow-hidden p-0!'>
          {channels.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <Separator />}
              <label htmlFor={item.id} className='flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm font-medium'>
                <RegistryIcon lucide={item.icon} aria-hidden='true' className='size-4 text-text-muted' />
                <span className='flex-1'>{item.label}</span>
                <Checkbox id={item.id} defaultChecked={item.checked} />
              </label>
            </div>
          ))}
        </FramePanel>
      </Frame>
    </div>
  );
}
