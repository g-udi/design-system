// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <Label htmlFor='label-demo-message'>Message</Label>
      <Textarea id='label-demo-message' placeholder='Type your message here…' />
    </Field>
  );
}
