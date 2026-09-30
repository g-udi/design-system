'use client';
import { useState } from 'react';
import {
  addDays,
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears
} from 'date-fns';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Card, CardContent } from '../../../../src/components/core/Card/parts/card.jsx';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';

const today = new Date();
// A due date looks ahead; a reporting range looks back and cannot end in the future.
const presets = {
  single: [
    { label: 'Today', value: today },
    { label: 'Tomorrow', value: addDays(today, 1) },
    { label: 'In a week', value: addDays(today, 7) },
    { label: 'In 2 weeks', value: addDays(today, 14) },
    { label: 'Next month', value: addDays(today, 30) }
  ],
  range: [
    { label: 'Today', value: { from: today, to: today } },
    {
      label: 'Yesterday',
      value: { from: subDays(today, 1), to: subDays(today, 1) }
    },
    { label: 'Last 7 days', value: { from: subDays(today, 6), to: today } },
    { label: 'Last 30 days', value: { from: subDays(today, 29), to: today } },
    { label: 'Month to date', value: { from: startOfMonth(today), to: today } },
    {
      label: 'Last month',
      value: {
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1))
      }
    },
    { label: 'Year to date', value: { from: startOfYear(today), to: today } },
    {
      label: 'Last year',
      value: {
        from: startOfYear(subYears(today, 1)),
        to: endOfYear(subYears(today, 1))
      }
    }
  ]
};
const disabled = { single: { before: today }, range: { after: today } };
const monthOf = (value) => value?.to ?? value;

export function Pattern() {
  const [mode, setMode] = useState('range');
  const [selection, setSelection] = useState({
    single: presets.single[2].value,
    range: presets.range[2].value
  });
  const [month, setMonth] = useState(today);
  const pick = (value) => {
    setSelection((current) => ({ ...current, [mode]: value }));
    setMonth(monthOf(value));
  };
  return (
    <div className='mx-auto flex w-fit max-w-full flex-col gap-3'>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        spacing={0}
        value={mode}
        onValueChange={(value) => {
          if (!value) return;
          setMode(value);
          setMonth(monthOf(selection[value]));
        }}
        aria-label='Preset type'
      >
        <ToggleGroupItem value='range'>Report range</ToggleGroupItem>
        <ToggleGroupItem value='single'>Due date</ToggleGroupItem>
      </ToggleGroup>
      <Card className='w-fit max-w-full p-0'>
        <CardContent className='flex p-0 max-sm:flex-col'>
          <div className='flex flex-col gap-0.5 border-border p-2 max-sm:order-1 max-sm:border-t sm:w-32 sm:border-e'>
            {presets[mode].map((preset) => (
              <Button
                key={preset.label}
                className='w-full justify-start'
                onClick={() => pick(preset.value)}
                size='sm'
                variant='ghost'
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <Calendar
            key={mode}
            mode={mode}
            month={month}
            onMonthChange={setMonth}
            selected={selection[mode]}
            onSelect={(value) =>
              value && setSelection((current) => ({ ...current, [mode]: value }))
            }
            disabled={disabled[mode]}
            fixedWeeks
          />
        </CardContent>
      </Card>
    </div>
  );
}
