import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
export function Pattern() {
  return (
    <div className='flex flex-col items-start justify-start gap-3'>
      <div className='flex items-center gap-2'>
        <Switch id='switch-disabled-unchecked' disabled />
        <Label htmlFor='switch-disabled-unchecked'>Disabled (Unchecked)</Label>
      </div>
      <div className='flex items-center gap-2'>
        <Switch id='switch-disabled-checked' defaultChecked disabled />
        <Label htmlFor='switch-disabled-checked'>Disabled (Checked)</Label>
      </div>
    </div>
  );
}
