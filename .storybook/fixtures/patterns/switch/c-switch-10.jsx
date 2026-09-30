import { Badge } from '../../../../src/components/core/Pill/parts/badge.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
export function Pattern() {
  return (
    <div className='flex flex-col gap-4'>
      <Field orientation='horizontal'>
        <Switch id='sw-badge-1' defaultChecked />
        <div className='flex items-center gap-2'>
          <FieldLabel htmlFor='sw-badge-1'>AI Copilot</FieldLabel>
          <Badge className='h-4.5 rounded-control px-1.5 text-xs tracking-wider uppercase'>
            New
          </Badge>
        </div>
      </Field>
      <Field orientation='horizontal'>
        <Switch id='sw-badge-2' />
        <div className='flex items-center gap-2'>
          <FieldLabel htmlFor='sw-badge-2'>Smart suggestions</FieldLabel>
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
