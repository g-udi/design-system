import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <div className='flex items-center justify-between gap-2'>
        <FieldLabel htmlFor='middle-name'>Middle Name</FieldLabel>
        <Badge variant='warning-outline' size='sm'>
          Optional
        </Badge>
      </div>
      <Input id='middle-name' placeholder='Alexander' />
    </Field>
  );
}
