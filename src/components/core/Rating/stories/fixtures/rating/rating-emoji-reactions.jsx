'use client';
import { useState } from 'react';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
const emojis = [
  { value: 1, emoji: '\u{1F61E}', label: 'Terrible' },
  { value: 2, emoji: '\u{1F615}', label: 'Bad' },
  { value: 3, emoji: '\u{1F610}', label: 'Okay' },
  { value: 4, emoji: '\u{1F60A}', label: 'Good' },
  { value: 5, emoji: '\u{1F929}', label: 'Amazing' }
];
export function Pattern() {
  const [selected, setSelected] = useState('');
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col items-center gap-3'>
      <p className='text-sm font-medium'>How was your experience?</p>
      <ToggleGroup type='single' spacing={1} value={selected} onValueChange={(value) => value && setSelected(value)} aria-label='Experience'>
        {emojis.map((item) => (
          <ToggleGroupItem
            key={item.value}
            value={String(item.value)}
            aria-label={item.label}
            className='size-8 p-0 text-2xl'
          >
            {item.emoji}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {selected && (
        <p className='text-text-muted text-sm'>
          {emojis.find((e) => String(e.value) === selected)?.label}
        </p>
      )}
    </div>
  );
}
