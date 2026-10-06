import { PhoneInput } from '@gaudi/design-system/core/PhoneInput';
import { Label } from '@gaudi/design-system/core/Field';

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
      <div className='grid gap-1.5'>
        <Label htmlFor='phone-empty'>Phone number</Label>
        <PhoneInput id='phone-empty' defaultCountry='NL' placeholder='Enter phone number' />
        <p className='text-xs text-text-muted'>Empty, Netherlands preselected</p>
      </div>
      <div className='grid gap-1.5'>
        <Label htmlFor='phone-readonly'>Office line</Label>
        <PhoneInput id='phone-readonly' readOnly value='+12125551234' />
        <p className='text-xs text-text-muted'>Read-only</p>
      </div>
      <div className='grid gap-1.5'>
        <Label htmlFor='phone-disabled'>Fax</Label>
        <PhoneInput id='phone-disabled' disabled defaultCountry='FR' value='+33612345678' />
        <p className='text-xs text-text-muted'>Disabled</p>
      </div>
      <div className='grid gap-1.5'>
        <Label htmlFor='phone-error'>Emergency contact</Label>
        <PhoneInput
          id='phone-error'
          aria-invalid='true'
          aria-describedby='phone-error-message'
          placeholder='Enter phone number'
        />
        <p id='phone-error-message' className='text-xs text-danger'>
          Enter a valid phone number.
        </p>
      </div>
    </div>
  );
}
