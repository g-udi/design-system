'use client';
import { useState } from 'react';
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import {
  Field,
  FieldDescription,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '../../../../src/components/core/InputOtp/parts/input-otp.jsx';

// Slot indexes per group: [[0, 1, 2], [3, 4, 5]] renders two groups split by a separator.
function Slots({ groups }) {
  return groups.map((slots, group) => [
    group ? <InputOTPSeparator key={`separator-${group}`} /> : null,
    <InputOTPGroup key={group}>
      {slots.map((index) => (
        <InputOTPSlot key={index} index={index} />
      ))}
    </InputOTPGroup>
  ]);
}

export function Pattern() {
  const [code, setCode] = useState('123456');
  return (
    <div className='mx-auto flex w-full max-w-lg flex-wrap gap-x-8 gap-y-3'>
      <Field className='w-auto'>
        <FieldLabel htmlFor='otp-digits'>Digits only</FieldLabel>
        <InputOTP id='otp-digits' maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <Slots groups={[[0, 1, 2, 3, 4, 5]]} />
        </InputOTP>
        <FieldDescription>Letters are rejected.</FieldDescription>
      </Field>
      <Field className='w-auto'>
        <FieldLabel htmlFor='otp-alphanumeric'>Letters and digits</FieldLabel>
        <InputOTP id='otp-alphanumeric' maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
          <Slots groups={[[0, 1, 2], [3, 4, 5]]} />
        </InputOTP>
        <FieldDescription>Two groups of three.</FieldDescription>
      </Field>
      <Field className='w-auto'>
        <FieldLabel htmlFor='otp-pin'>Four-digit PIN</FieldLabel>
        <InputOTP id='otp-pin' maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
          <Slots groups={[[0, 1, 2, 3]]} />
        </InputOTP>
        <FieldDescription>Short codes for PINs.</FieldDescription>
      </Field>
      <Field className='w-auto'>
        <FieldLabel htmlFor='otp-controlled'>Controlled</FieldLabel>
        <InputOTP id='otp-controlled' maxLength={6} value={code} onChange={setCode}>
          <Slots groups={[[0, 1], [2, 3], [4, 5]]} />
        </InputOTP>
        <FieldDescription className='tabular-nums'>Value: {code || 'empty'}</FieldDescription>
      </Field>
    </div>
  );
}
