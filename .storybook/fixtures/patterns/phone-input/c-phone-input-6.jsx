import { PhoneInput } from '../../../../src/components/core/PhoneInput/parts/phone-input-extended.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xs gap-1.5'>
      <Label htmlFor='phone-error'>Phone number</Label>
      <PhoneInput
        id='phone-error'
        aria-invalid='true'
        aria-describedby='phone-error-message'
        placeholder='Enter phone number'
      />
      <p id='phone-error-message' className='text-ui-destructive text-xs'>
        Enter a valid phone number.
      </p>
    </div>
  );
}
