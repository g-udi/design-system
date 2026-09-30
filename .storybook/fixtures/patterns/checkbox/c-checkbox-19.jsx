import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
export function Pattern() {
  return (
    <Field className='w-auto'>
      <Field orientation='horizontal'>
        <Checkbox id='checkbox-badge-1' />
        <div className='flex items-center gap-3'>
          <FieldLabel htmlFor='checkbox-badge-1'>
            AI-powered suggestions
          </FieldLabel>
          <Badge className='rounded-control uppercase' size='sm'>
            New
          </Badge>
        </div>
      </Field>
      <Field orientation='horizontal' defaultChecked>
        <Checkbox id='checkbox-badge-2' />
        <div className='flex items-center gap-3'>
          <FieldLabel htmlFor='checkbox-badge-2'>
            Beta feature access
          </FieldLabel>
          <Badge
            variant='secondary'
            className='rounded-control uppercase'
            size='sm'
          >
            Beta
          </Badge>
        </div>
      </Field>
    </Field>
  );
}
