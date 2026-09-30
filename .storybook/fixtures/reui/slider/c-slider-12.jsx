// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
const emojis = [
  '\u{1F621}',
  '\u{1F641}',
  '\u{1F610}',
  '\u{1F642}',
  '\u{1F60D}'
];
const labels = ['Awful', 'Poor', 'Okay', 'Good', 'Amazing'];
export function Pattern() {
  const [value, setValue] = useState(3);
  return (
    <div className='mx-auto grid w-full max-w-sm gap-3'>
      <Label className='text-sm font-medium'>Rate your experience</Label>
      <div className='flex items-center gap-3'>
        <Slider
          value={[value]}
          onValueChange={(val) =>
            setValue(Array.isArray(val) ? (val[0] ?? 3) : val)
          }
          min={1}
          max={5}
          step={1}
        />
        <span className='text-2xl' aria-hidden='true'>
          {emojis[value - 1]}
        </span>
      </div>
      <span className='text-ui-muted-foreground text-center text-xs font-medium'>
        {labels[value - 1]}
      </span>
    </div>
  );
}
