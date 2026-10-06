# InputOtp

> Core/InputOtp · core · `@gaudi/design-system/core/InputOtp`

One-time code entry with grouped slots, paste support and completion feedback.

## Import

```js
import { InputOTP } from '@gaudi/design-system/core/InputOtp';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `InputOTP`, `InputOTPGroup`, `InputOTPSeparator`, `InputOTPSlot`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `maxLength` | `number` | `Required` | no | Number of characters accepted. |
| `value / onChange` | `string / (value: string) => void` | — | no | Controlled code entry. |
| `onComplete` | `(value: string) => void` | — | no | Called when every slot is filled. |
| `pattern` | `string` | — | no | Allowed character pattern. |
| `disabled` | `boolean` | `false` | no | Dims every slot and blocks code entry. |
| `containerClassName` | `string` | — | no | Classes on the slot container. |
| `InputOTPSlot.index` | `number` | `Required` | no | Zero-based character index. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `Native input props / ref` | `InputHTMLAttributes<HTMLInputElement>` | — | yes | Forwards value, defaultValue, onChange, disabled, required, name, autocomplete and ARIA attributes to the input. |

## Usage

```jsx
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@gaudi/design-system/core/InputOtp';

<InputOTP maxLength={6} aria-label='Verification code' value={code} onChange={setCode}>
  <InputOTPGroup>{Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} />)}</InputOTPGroup>
</InputOTP>
```

## Accessibility

The underlying input supports keyboard entry and paste. Label the complete code field and announce validation beside it.

## Examples

- Playground (Storybook `core-inputotp--playground`)

Curated patterns:

- Code formats — registry item `@gaudi/input-otp-code-formats` (uses `FieldDescriptionPrimitive`, `FieldLabelPrimitive`, `FieldRoot`, `InputOTP`, `InputOTPGroup`, `InputOTPSeparator`, `InputOTPSlot`)

## README

Separate boxes for a one-time code, such as a sign-in or verification code sent by email or text.

### Usage

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

### Accessibility

One real input sits behind the slots, so pasting, autofill and screen readers treat the code as a single field. Give it an `aria-label` or a visible label.
