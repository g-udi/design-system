import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';

const tones = [
  { id: 'sw-info', label: 'Info', className: 'data-checked:bg-info' },
  { id: 'sw-success', label: 'Success', className: 'data-checked:bg-success' },
  { id: 'sw-warning', label: 'Warning', className: 'data-checked:bg-warning' }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xs gap-3'>
      <div className='flex flex-wrap items-center gap-4'>
        {tones.map((tone) => (
          <div key={tone.id} className='flex items-center gap-2'>
            <Switch id={tone.id} defaultChecked className={tone.className} />
            <Label htmlFor={tone.id}>{tone.label}</Label>
          </div>
        ))}
      </div>
      <FieldLabel htmlFor='sw-danger'>
        <Field orientation='horizontal'>
          <FieldContent>
            <FieldTitle className='text-danger'>Delete all data on sign out</FieldTitle>
            <FieldDescription>
              Local data is permanently removed when you sign out. This cannot be undone.
            </FieldDescription>
          </FieldContent>
          <Switch id='sw-danger' className='data-checked:bg-danger' />
        </Field>
      </FieldLabel>
    </div>
  );
}
