'use client';
import { useState } from 'react';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';

const first = (value, fallback) => (Array.isArray(value) ? (value[0] ?? fallback) : value);
const temperatureName = (kelvin) => {
  if (kelvin <= 3000) return 'Warm';
  if (kelvin <= 4500) return 'Neutral';
  if (kelvin <= 5500) return 'Daylight';
  return 'Cool';
};
const moods = [
  { emoji: '\u{1F621}', label: 'Awful' },
  { emoji: '\u{1F641}', label: 'Poor' },
  { emoji: '\u{1F610}', label: 'Okay' },
  { emoji: '\u{1F642}', label: 'Good' },
  { emoji: '\u{1F60D}', label: 'Amazing' }
];

export function Pattern() {
  const [volume, setVolume] = useState(50);
  const [temperature, setTemperature] = useState(4500);
  const [mood, setMood] = useState(3);
  return (
    <div className='mx-auto grid w-full max-w-sm gap-6'>
      {/* A tooltip that rides above the thumb. */}
      <div className='grid gap-2'>
        <Label>Volume</Label>
        <div className='relative pt-7'>
          <div
            className='absolute top-0 rounded bg-text px-2 py-0.5 text-xs font-semibold tabular-nums text-surface'
            style={{ left: `${volume}%`, transform: 'translateX(-50%)' }}
          >
            {volume}%
            <div className='absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-text' />
          </div>
          <Slider aria-label='Volume' value={[volume]} onValueChange={(v) => setVolume(first(v, 50))} max={100} step={1} />
        </div>
      </div>
      {/* A gradient scale above the track, with a named readout. */}
      <div className='grid gap-2'>
        <div className='flex items-center justify-between'>
          <Label>Color temperature</Label>
          <span className='text-xs font-medium tabular-nums text-text-muted'>
            {temperature}K &middot; {temperatureName(temperature)}
          </span>
        </div>
        <div aria-hidden='true' className='h-2 rounded-full bg-linear-to-r from-orange-400 via-amber-50 to-blue-300' />
        <Slider
          aria-label='Color temperature'
          value={[temperature]}
          onValueChange={(v) => setTemperature(first(v, 4500))}
          min={2700}
          max={6500}
          step={100}
        />
      </div>
      {/* A five-step scale read out as an emoji and a word. */}
      <div className='grid gap-2'>
        <div className='flex items-center justify-between'>
          <Label>Rate your experience</Label>
          <span className='text-xs font-medium text-text-muted'>{moods[mood - 1].label}</span>
        </div>
        <div className='flex items-center gap-3'>
          <Slider aria-label='Experience' value={[mood]} onValueChange={(v) => setMood(first(v, 3))} min={1} max={5} step={1} />
          <span className='text-2xl leading-none' aria-hidden='true'>{moods[mood - 1].emoji}</span>
        </div>
      </div>
    </div>
  );
}
