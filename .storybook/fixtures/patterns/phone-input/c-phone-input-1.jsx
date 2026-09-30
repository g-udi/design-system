import { PhoneInput } from '../../../../src/components/core/PhoneInput/parts/phone-input-extended.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xs gap-1.5'>
      <Label htmlFor='phone-basic'>Phone number</Label>
      <PhoneInput id='phone-basic' placeholder='Enter phone number' />
    </div>
  );
}
