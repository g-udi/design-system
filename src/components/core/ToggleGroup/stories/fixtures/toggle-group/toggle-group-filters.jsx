import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const statuses = ['All', 'Active', 'Completed', 'Archived'];
const ranges = ['1H', '6H', '24H', '7D', '30D', 'All'];
const channels = [
  { value: 'email', label: 'Email', icon: 'MailIcon' },
  { value: 'sms', label: 'SMS', icon: 'PhoneIcon' },
  { value: 'push', label: 'Push', icon: 'BellIcon' },
  { value: 'chat', label: 'Chat', icon: 'MessageSquareIcon' }
];
const Field = ({ label, children }) => (
  <div className='flex flex-col gap-1.5'>
    <span className='text-xs font-medium text-text-muted'>{label}</span>
    {children}
  </div>
);

export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
      <Field label='Status'>
        <ToggleGroup type='single' variant='outline' size='sm' spacing={0} defaultValue='Active' aria-label='Status'>
          {statuses.map((status) => <ToggleGroupItem key={status} value={status}>{status}</ToggleGroupItem>)}
        </ToggleGroup>
      </Field>
      <Field label='Time range'>
        <ToggleGroup type='single' variant='outline' size='sm' spacing={0} defaultValue='24H' aria-label='Time range'>
          {ranges.map((range) => <ToggleGroupItem key={range} value={range} className='tabular-nums'>{range}</ToggleGroupItem>)}
        </ToggleGroup>
      </Field>
      <Field label='Notify me by'>
        <ToggleGroup type='multiple' variant='outline' size='sm' spacing={1} defaultValue={['email', 'push']} aria-label='Notification channels'>
          {channels.map(({ value, label, icon }) => (
            <ToggleGroupItem key={value} value={value}><RegistryIcon lucide={icon} />{label}</ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>
    </div>
  );
}
