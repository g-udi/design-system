'use client';
import { useState } from 'react';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
export function Pattern() {
  const [temperature, setTemperature] = useState(4500);
  const getLabel = (temp) => {
    if (temp <= 3e3) return 'Warm';
    if (temp <= 4500) return 'Neutral';
    if (temp <= 5500) return 'Daylight';
    return 'Cool';
  };
  return (
    <div className='mx-auto grid w-full max-w-sm gap-4'>
      <div className='flex items-center justify-between'>
        <Label className='text-sm font-medium'>Color Temperature</Label>
        <span className='text-ui-muted-foreground text-xs font-medium tabular-nums'>
          {temperature}K &middot; {getLabel(temperature)}
        </span>
      </div>
      {/* warm-to-cool scale drawn from the palette's orange, amber and blue */}
      <div
        aria-hidden='true'
        className='h-2 rounded-full bg-linear-to-r from-orange-400 via-amber-50 to-blue-300'
      />
      <Slider
        value={[temperature]}
        onValueChange={(val) =>
          setTemperature(Array.isArray(val) ? (val[0] ?? 4500) : val)
        }
        min={2700}
        max={6500}
        step={100}
      />
    </div>
  );
}
