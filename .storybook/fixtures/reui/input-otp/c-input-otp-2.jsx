// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '../../../../src/components/core/InputOtp/parts/input-otp.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Field>
        <FieldLabel htmlFor='digits-only'>Digits Only</FieldLabel>
        <InputOTP id='digits-only' maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </div>
  );
}
