// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <Label htmlFor='label-badge' className='gap-2'>
        Webhook URL
        <Badge variant='success-light' size='sm'>
          Active
        </Badge>
      </Label>
      <Input
        id='label-badge'
        type='url'
        defaultValue='https://api.example.com/webhooks'
        className='font-mono text-xs'
      />
    </Field>
  );
}
