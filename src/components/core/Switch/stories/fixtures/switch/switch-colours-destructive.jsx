import { useId } from 'react';
import {
  FieldRoot as Field,
  FieldContent,
  FieldDescriptionPrimitive as FieldDescription,
  FieldLabelPrimitive as FieldLabel,
  FieldTitle
} from '@gaudi/design-system/core/Field';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';

const tones = [
  { id: 'sw-info', label: 'Info', className: 'data-checked:bg-info' },
  { id: 'sw-success', label: 'Success', className: 'data-checked:bg-success' },
  { id: 'sw-warning', label: 'Warning', className: 'data-checked:bg-warning' }
];

export function Pattern() {
  const id = useId();
  return (
    <div className='mx-auto grid w-full max-w-xs gap-3'>
      <div className='flex flex-wrap items-center gap-4'>
        {tones.map((tone) => (
          <div key={tone.id} className='flex items-center gap-2'>
            <Switch id={`${id}-${tone.id}`} defaultChecked className={tone.className} />
            <Label htmlFor={`${id}-${tone.id}`}>{tone.label}</Label>
          </div>
        ))}
      </div>
      <FieldLabel htmlFor={`${id}-sw-danger`}>
        <Field orientation='horizontal'>
          <FieldContent>
            <FieldTitle className='text-danger'>Delete all data on sign out</FieldTitle>
            <FieldDescription>
              Local data is permanently removed when you sign out. This cannot be undone.
            </FieldDescription>
          </FieldContent>
          <Switch id={`${id}-sw-danger`} className='data-checked:bg-danger' />
        </Field>
      </FieldLabel>
    </div>
  );
}
