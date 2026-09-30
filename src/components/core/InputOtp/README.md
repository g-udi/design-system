# InputOtp

Separate boxes for a one-time code, such as a sign-in or verification code sent by email or text.

## Usage

```jsx
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@gaudi/design-system';

<InputOTP maxLength={6} aria-label='Verification code' value={code} onChange={setCode}>
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
</InputOTP>;
```

`pattern` limits which characters are accepted, and `onComplete` fires once every slot is filled.

## Accessibility

One real input sits behind the slots, so pasting, autofill and screen readers treat the code as a single field. Give it an `aria-label` or a visible label.
