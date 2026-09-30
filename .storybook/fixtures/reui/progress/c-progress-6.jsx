// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
export function Pattern() {
  const [value, setValue] = useState(50);
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col gap-6'>
      <Progress value={value} />
      <Slider
        value={[value]}
        onValueChange={(value2) => setValue(value2)}
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
}
