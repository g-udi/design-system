import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { Badge } from '@gaudi/design-system/core/Pill';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const Row = ({ label, children }) => (
  <>
    <span className='text-xs text-text-muted'>{label}</span>
    <div className='flex flex-wrap items-center gap-3'>{children}</div>
  </>
);
const formatting = [
  { value: 'bold', label: 'Bold', icon: 'BoldIcon' },
  { value: 'italic', label: 'Italic', icon: 'ItalicIcon' },
  { value: 'underline', label: 'Underline', icon: 'UnderlineIcon' }
];
const Formatting = (props) => (
  <ToggleGroup type='multiple' spacing={1} aria-label='Formatting' {...props}>
    {formatting.map(({ value, label, icon }) => (
      <ToggleGroupItem key={value} value={value} aria-label={label}><RegistryIcon lucide={icon} /></ToggleGroupItem>
    ))}
  </ToggleGroup>
);
const periods = ['Day', 'Week', 'Month'];
const Periods = ({ spacing }) => (
  <ToggleGroup type='single' variant='outline' spacing={spacing} defaultValue='Week' aria-label={`Period, spacing ${spacing}`}>
    {periods.map((period) => <ToggleGroupItem key={period} value={period}>{period}</ToggleGroupItem>)}
  </ToggleGroup>
);
const connections = [
  { value: 'wifi', label: 'Wi-Fi', icon: 'WifiIcon' },
  { value: 'bluetooth', label: 'Bluetooth', icon: 'BluetoothIcon' },
  { value: 'airplane', label: 'Airplane mode', icon: 'PlaneIcon' }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-2xl grid-cols-1 sm:grid-cols-[5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-3'>
      <Row label='Variant'>
        <Formatting defaultValue={['bold']} />
        <Formatting variant='outline' defaultValue={['italic']} />
      </Row>
      <Row label='Spacing'>
        <Periods spacing={0} />
        <Periods spacing={2} />
      </Row>
      <Row label='Size'>
        <ToggleGroup type='single' variant='outline' size='sm' defaultValue='m' aria-label='Shirt size'>
          {['S', 'M', 'L', 'XL'].map((size) => <ToggleGroupItem key={size} value={size.toLowerCase()}>{size}</ToggleGroupItem>)}
        </ToggleGroup>
        <ToggleGroup type='single' variant='outline' defaultValue='top' aria-label='Position'>
          <ToggleGroupItem value='top'>Top</ToggleGroupItem>
          <ToggleGroupItem value='bottom'>Bottom</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type='single' variant='outline' size='lg' defaultValue='yearly' aria-label='Billing'>
          <ToggleGroupItem value='monthly'>Monthly</ToggleGroupItem>
          <ToggleGroupItem value='yearly' className='gap-2'>
            Yearly
            <Badge variant='success-light'>Save 20%</Badge>
          </ToggleGroupItem>
        </ToggleGroup>
      </Row>
      <Row label='Vertical'>
        <Formatting orientation='vertical' variant='outline' />
        <ToggleGroup type='multiple' orientation='vertical' spacing={1} defaultValue={['wifi', 'bluetooth']} aria-label='Connections'>
          {connections.map(({ value, label, icon }) => (
            <ToggleGroupItem key={value} value={value} className='justify-start'><RegistryIcon lucide={icon} />{label}</ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Row>
    </div>
  );
}
