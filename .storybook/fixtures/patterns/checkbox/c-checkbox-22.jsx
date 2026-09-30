import { Badge } from '../../../../src/components/core/Pill/parts/badge.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
export function Pattern() {
  return (
    <div className='flex flex-col gap-4'>
      <Field orientation='horizontal' className='w-auto'>
        <Checkbox id='badge-1' defaultChecked />
        <div className='flex items-center gap-2'>
          <FieldLabel htmlFor='badge-1'>AI-powered suggestions</FieldLabel>
          <Badge className='h-4.5 rounded-control px-1.5 text-xs tracking-wider uppercase'>
            New
          </Badge>
        </div>
      </Field>

      <Field orientation='horizontal' className='w-auto'>
        <Checkbox id='badge-2' />
        <div className='flex items-center gap-2'>
          <FieldLabel htmlFor='badge-2'>Beta feature access</FieldLabel>
          <Badge
            variant='secondary'
            className='h-4.5 rounded-control px-1.5 text-xs tracking-wider uppercase'
          >
            Beta
          </Badge>
        </div>
      </Field>
    </div>
  );
}
