// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '../../../../src/components/core/InputOtp/parts/input-otp.jsx';
export function Pattern() {
  const [value, setValue] = useState('123456');
  return (
    <div className='flex items-center justify-center'>
      <Field>
        <FieldLabel htmlFor='multi-separator'>Multi-Separator</FieldLabel>
        <InputOTP
          id='multi-separator'
          maxLength={6}
          value={value}
          onChange={setValue}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </div>
  );
}
