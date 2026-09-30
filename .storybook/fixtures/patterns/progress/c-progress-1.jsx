'use client';
import { useState } from 'react';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
const sizes = [
  { label: 'Small', className: 'h-1' },
  { label: 'Default', className: 'h-2' },
  { label: 'Large', className: 'h-3' }
];
const colors = [
  { label: 'Success', className: '**:data-[slot=progress-indicator]:bg-success' },
  { label: 'Warning', className: '**:data-[slot=progress-indicator]:bg-warning' },
  { label: 'Danger', className: '**:data-[slot=progress-indicator]:bg-danger' },
  { label: 'Custom', className: '**:data-[slot=progress-indicator]:bg-violet-500' }
];
function Row({ label, value, className }) {
  return (
    <div className='grid grid-cols-[4rem_1fr] items-center gap-3'>
      <span className='text-text-muted text-xs'>{label}</span>
      <Progress value={value} aria-label={`${label} progress`} className={className} />
    </div>
  );
}
export function Pattern() {
  const [value, setValue] = useState(56);
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col gap-3'>
      <div className='flex items-center justify-between gap-3'>
        <span className='text-sm font-medium'>Upload progress</span>
        <span className='text-text-muted text-sm tabular-nums'>{value}%</span>
      </div>
      <Slider
        aria-label='Progress value'
        value={[value]}
        onValueChange={([next]) => setValue(next)}
        min={0}
        max={100}
        step={1}
      />
      <div className='flex flex-col gap-2'>
        {sizes.map((size) => (
          <Row key={size.label} value={value} {...size} />
        ))}
      </div>
      <div className='flex flex-col gap-2'>
        {colors.map((color) => (
          <Row key={color.label} value={value} className={`h-2 ${color.className}`} label={color.label} />
        ))}
      </div>
    </div>
  );
}
