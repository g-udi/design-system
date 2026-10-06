import { p, children, nativeInput, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/InputOtp": {
    ...definition('One-time code entry with grouped slots, paste support and completion feedback.', [p('maxLength', 'number', 'Required', 'Number of characters accepted.'), p('value / onChange', 'string / (value: string) => void', '—', 'Controlled code entry.'), p('onComplete', '(value: string) => void', '—', 'Called when every slot is filled.'), p('pattern', 'string', '—', 'Allowed character pattern.'), p('disabled', 'boolean', 'false', 'Dims every slot and blocks code entry.'), p('containerClassName', 'string', '—', 'Classes on the slot container.'), p('InputOTPSlot.index', 'number', 'Required', 'Zero-based character index.'), children, nativeInput], 'The underlying input supports keyboard entry and paste. Label the complete code field and announce validation beside it.'),
    usage: "import { InputOTP, InputOTPGroup, InputOTPSlot } from '@gaudi/design-system/core/InputOtp';\n\n<InputOTP maxLength={6} aria-label='Verification code' value={code} onChange={setCode}>\n  <InputOTPGroup>{Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} />)}</InputOTPGroup>\n</InputOTP>"
  }
};
