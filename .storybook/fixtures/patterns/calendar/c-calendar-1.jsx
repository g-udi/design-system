'use client';
import { useState } from 'react';
import { addDays } from 'date-fns';
import { de, enUS, zhCN } from 'react-day-picker/locale';
import { Card, CardContent } from '../../../../src/components/core/Card/parts/card.jsx';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';

const today = new Date();
// Each mode keeps a selection of its own shape.
const initialSelection = {
  single: today,
  multiple: [addDays(today, 2), addDays(today, 6), addDays(today, 8)],
  range: { from: addDays(today, 3), to: addDays(today, 9) }
};
const modes = [
  { value: 'single', label: 'Single' },
  { value: 'multiple', label: 'Multiple' },
  { value: 'range', label: 'Range' }
];
const locales = [
  { value: 'en', label: 'EN', locale: enUS },
  { value: 'de', label: 'DE', locale: de },
  { value: 'zh', label: '中文', locale: zhCN }
];
const options = [
  { key: 'twoMonths', label: 'Two months' },
  { key: 'weekNumbers', label: 'Week numbers' },
  { key: 'outsideDays', label: 'Outside days' },
  { key: 'rounded', label: 'Rounded days' },
  { key: 'noWeekends', label: 'Disable weekends' }
];

export function Pattern() {
  const [mode, setMode] = useState('range');
  const [locale, setLocale] = useState('en');
  const [selection, setSelection] = useState(initialSelection);
  const [flags, setFlags] = useState({
    twoMonths: false,
    weekNumbers: false,
    outsideDays: true,
    rounded: false,
    noWeekends: false
  });
  return (
    <div className='mx-auto flex w-fit max-w-full flex-col gap-3'>
      <div className='flex flex-wrap items-center gap-2'>
        <ToggleGroup
          type='single'
          variant='outline'
          size='sm'
          spacing={0}
          value={mode}
          onValueChange={(value) => value && setMode(value)}
          aria-label='Selection mode'
        >
          {modes.map((item) => (
            <ToggleGroupItem key={item.value} value={item.value}>
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ToggleGroup
          type='single'
          variant='outline'
          size='sm'
          spacing={0}
          value={locale}
          onValueChange={(value) => value && setLocale(value)}
          aria-label='Language'
        >
          {locales.map((item) => (
            <ToggleGroupItem key={item.value} value={item.value}>
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div
        role='group'
        aria-label='Display options'
        className='flex max-w-sm flex-wrap gap-x-4 gap-y-2'
      >
        {options.map((option) => (
          <Label key={option.key} className='gap-2 text-sm font-normal'>
            <Switch
              size='sm'
              checked={flags[option.key]}
              onCheckedChange={(checked) =>
                setFlags((current) => ({ ...current, [option.key]: checked }))
              }
            />
            {option.label}
          </Label>
        ))}
      </div>
      <Card className='w-fit max-w-full p-0'>
        <CardContent className='p-0'>
          <Calendar
            className={flags.rounded ? '[--cell-radius:9999px]' : undefined}
            mode={mode}
            selected={selection[mode]}
            onSelect={(value) => setSelection((current) => ({ ...current, [mode]: value }))}
            locale={locales.find((item) => item.value === locale).locale}
            numerals='latn'
            numberOfMonths={flags.twoMonths ? 2 : 1}
            showWeekNumber={flags.weekNumbers}
            showOutsideDays={flags.outsideDays}
            fixedWeeks
            disabled={flags.noWeekends ? { dayOfWeek: [0, 6] } : undefined}
            excludeDisabled={flags.noWeekends}
          />
        </CardContent>
      </Card>
    </div>
  );
}
