// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '../../../../src/components/core/InputOtp/parts/input-otp.jsx';
import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='verification-method'>
            Verification Method
          </FieldLabel>
          <NativeSelect id='verification-method' defaultValue='email'>
            <NativeSelectOption value='email'>Email Address</NativeSelectOption>
            <NativeSelectOption value='sms'>
              SMS Text Message
            </NativeSelectOption>
            <NativeSelectOption value='app'>
              Authenticator App
            </NativeSelectOption>
          </NativeSelect>
          <FieldDescription>
            Choose how you want to receive your security code.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor='otp-code'>Security Code</FieldLabel>
          <InputOTP id='otp-code' maxLength={6}>
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
          <FieldDescription>
            Enter the 6-digit code to verify your identity.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
}
