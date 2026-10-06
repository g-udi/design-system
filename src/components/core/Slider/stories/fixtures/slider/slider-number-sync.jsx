'use client';
import { useId, useState } from 'react';

import { Label } from '@gaudi/design-system/core/Field';
import { Slider } from '@gaudi/design-system/core/Slider';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '@gaudi/design-system/core/NumberField';
export function Pattern() {
  const id = useId();
  const [value, setValue] = useState(50);
  return (
    <div className='mx-auto grid w-full max-w-sm gap-4'>
      <div className='flex items-center justify-between'>
        <Label htmlFor={id} className='text-sm font-medium'>
          Opacity
        </Label>
        <div className='flex items-center gap-1.5'>
          <NumberField id={id} value={(value) === '' || !Number.isFinite(Number(value)) ? null : Number(value)} onValueChange={(value) => {
              const v = Number((value ?? ''));
              if (v >= 0 && v <= 100) setValue(v);
            }} min={0} max={100} className='w-16 text-center text-sm tabular-nums'>
            <NumberFieldGroup>
              <NumberFieldInput />
            </NumberFieldGroup>
          </NumberField>
          <span className='text-text-muted text-xs'>%</span>
        </div>
      </div>
      <Slider
        aria-label='Opacity'
        value={[value]}
        onValueChange={(val) =>
          setValue(Array.isArray(val) ? (val[0] ?? 50) : val)
        }
        max={100}
        step={1}
      />
    </div>
  );
}
