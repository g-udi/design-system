import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup
        type='multiple'
        orientation='vertical'
        spacing={1}
        defaultValue={['wifi', 'bluetooth']}
      >
        <ToggleGroupItem value='wifi' aria-label='Wi-Fi' className='w-full'>
          <RegistryIcon lucide='WifiIcon' />
          Wi-Fi
        </ToggleGroupItem>
        <ToggleGroupItem
          value='bluetooth'
          aria-label='Bluetooth'
          className='w-full'
        >
          <RegistryIcon lucide='BluetoothIcon' />
          Bluetooth
        </ToggleGroupItem>
        <ToggleGroupItem
          value='airplane'
          aria-label='Airplane Mode'
          className='w-full'
        >
          <RegistryIcon lucide='PlaneIcon' />
          Airplane Mode
        </ToggleGroupItem>
        <ToggleGroupItem
          value='location'
          aria-label='Location'
          className='w-full'
        >
          <RegistryIcon lucide='MapPinIcon' />
          Location
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
