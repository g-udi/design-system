'use client';
import { useState } from 'react';
import { PhoneInput } from '../../../../src/components/core/PhoneInput/parts/phone-input-extended.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
export function Pattern() {
  const [phone, setPhone] = useState('+31612345678');
  return (
    <div className='mx-auto grid w-full max-w-xs gap-1.5'>
      <Label htmlFor='phone-small'>Phone number</Label>
      <PhoneInput
        id='phone-small'
        variant='sm'
        defaultCountry='NL'
        placeholder='Enter phone number'
        value={phone}
        onChange={setPhone}
      />
    </div>
  );
}
