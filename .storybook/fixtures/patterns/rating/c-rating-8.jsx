'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
const emojis = [
  { value: 1, emoji: '\u{1F61E}', label: 'Terrible' },
  { value: 2, emoji: '\u{1F615}', label: 'Bad' },
  { value: 3, emoji: '\u{1F610}', label: 'Okay' },
  { value: 4, emoji: '\u{1F60A}', label: 'Good' },
  { value: 5, emoji: '\u{1F929}', label: 'Amazing' }
];
export function Pattern() {
  const [selected, setSelected] = useState(null);
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col items-center gap-3'>
      <p className='text-sm font-medium'>How was your experience?</p>
      <div className='flex gap-2'>
        {emojis.map((item) => (
          <button
            key={item.value}
            type='button'
            aria-label={item.label}
            aria-pressed={selected === item.value}
            onClick={() => setSelected(item.value)}
            className={cn(
              'rounded-lg flex size-10 items-center justify-center border-2 text-2xl transition-all',
              selected === item.value
                ? 'border-ui-border bg-ui-muted scale-110'
                : 'hover:bg-ui-muted border-transparent'
            )}
          >
            {item.emoji}
          </button>
        ))}
      </div>
      {selected && (
        <p className='text-ui-muted-foreground text-sm'>
          {emojis.find((e) => e.value === selected)?.label}
        </p>
      )}
    </div>
  );
}
