// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
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
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Field>
        <FieldLabel htmlFor='alphanumeric'>Alphanumeric OTP</FieldLabel>
        <FieldDescription>Accepts both letters and numbers.</FieldDescription>
        <InputOTP
          id='alphanumeric'
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </div>
  );
}
