import {
  Field,
  FieldDescription
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <div className='flex flex-col gap-1'>
        <Label htmlFor='label-helper'>API Key</Label>
        <FieldDescription>
          Your secret key for API authentication
        </FieldDescription>
      </div>
      <Input
        id='label-helper'
        placeholder='sk_live_...'
        className='font-mono'
      />
    </Field>
  );
}
