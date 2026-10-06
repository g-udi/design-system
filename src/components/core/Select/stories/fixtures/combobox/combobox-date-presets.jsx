'use client';
import * as React from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfDay
} from 'date-fns';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Calendar } from '@gaudi/design-system/core/Calendar';
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger
} from '@gaudi/design-system/core/Select';
import {
  DialogRoot as Dialog,
  DialogClosePrimitive as DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@gaudi/design-system/core/Dialog';
import { FieldRoot as Field } from '@gaudi/design-system/core/Field';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const noDateOption = {
  type: 'none',
  id: 'no-date',
  label: 'No date',
  searchText: 'No date unset blank none'
};
const customDateOption = {
  type: 'custom',
  id: 'custom-date',
  label: 'Custom date...',
  searchText: 'Custom date pick a day open calendar specific date'
};
function CalendarGlyph({ className }) {
  return (
    <RegistryIcon
      lucide='CalendarIcon'
      className={cn('size-4 shrink-0', className)}
    />
  );
}
function CalendarSearchGlyph({ className }) {
  return (
    <RegistryIcon
      lucide='CalendarSearchIcon'
      className={cn('size-4 shrink-0', className)}
    />
  );
}
function DateTriggerLabel({ value, placeholder }) {
  if (!value) {
    return (
      <span className='flex min-w-0 items-center gap-2'>
        <CalendarGlyph className='text-text-muted' />
        <span className='text-text-muted truncate'>{placeholder}</span>
      </span>
    );
  }
  const displayLabel =
    value.type === 'custom' ? format(value.date, 'MMM d') : value.label;
  return (
    <span className='flex min-w-0 items-center gap-2'>
      <CalendarGlyph className='text-text-muted' />
      <span className='truncate'>{displayLabel}</span>
    </span>
  );
}
function DateOptionRow({ option }) {
  if (option.type === 'none') {
    return (
      <span className='flex min-w-0 items-center gap-2'>
        <CalendarGlyph className='text-text-muted' />
        <span className='truncate'>{option.label}</span>
      </span>
    );
  }
  if (option.type === 'custom') {
    return (
      <span className='flex min-w-0 items-center gap-2'>
        <CalendarSearchGlyph className='text-text-muted' />
        <span className='truncate'>{option.label}</span>
      </span>
    );
  }
  return (
    <span className='flex w-full min-w-0 items-center justify-between gap-3'>
      <span className='flex min-w-0 items-center gap-2'>
        <CalendarGlyph className='text-text-muted' />
        <span className='truncate'>{option.label}</span>
      </span>
      <span className='text-text-muted shrink-0 text-sm tabular-nums'>
        {format(option.date, 'dd/MM/yyyy')}
      </span>
    </span>
  );
}
function getUpcomingWeekEnd(today) {
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  return isSameDay(today, weekEnd) ? addWeeks(weekEnd, 1) : weekEnd;
}
function getUpcomingMonthEnd(today) {
  const monthEnd = endOfMonth(today);
  return isSameDay(today, monthEnd)
    ? endOfMonth(addMonths(today, 1))
    : monthEnd;
}
function DateSelectionCombobox({ value, onValueChange }) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [draftDate, setDraftDate] = React.useState(
    value?.date ?? addDays(today, 1)
  );
  const presetOptions = React.useMemo(
    () => [
      {
        type: 'preset',
        id: 'tomorrow',
        label: 'Tomorrow',
        date: addDays(today, 1),
        searchText: 'Tomorrow in one day publish'
      },
      {
        type: 'preset',
        id: 'end-of-week',
        label: 'End of week',
        date: getUpcomingWeekEnd(today),
        searchText: 'End of week Sunday weekend deadline'
      },
      {
        type: 'preset',
        id: 'in-one-week',
        label: 'In one week',
        date: addWeeks(today, 1),
        searchText: 'In one week 7 days from today'
      },
      {
        type: 'preset',
        id: 'end-of-month',
        label: 'End of month',
        date: getUpcomingMonthEnd(today),
        searchText: 'End of month last day monthly deadline'
      },
      {
        type: 'preset',
        id: 'in-one-month',
        label: 'In one month',
        date: addMonths(today, 1),
        searchText: 'In one month 30 days from today'
      }
    ],
    [today]
  );
  const dateOptions = [noDateOption, ...presetOptions, customDateOption];
  const activePreset =
    value?.type === 'preset'
      ? (presetOptions.find((option) => option.id === value.id) ?? null)
      : !value
        ? noDateOption
        : null;
  React.useEffect(() => {
    if (!pickerOpen) {
      return;
    }
    setDraftDate(value?.date ?? addDays(today, 1));
  }, [pickerOpen, today, value]);
  function handleOptionChange(nextValue) {
    if (!nextValue) {
      return;
    }
    if (nextValue.type === 'none') {
      onValueChange(null);
      return;
    }
    if (nextValue.type === 'custom') {
      requestAnimationFrame(() => setPickerOpen(true));
      return;
    }
    onValueChange({
      type: 'preset',
      id: nextValue.id,
      label: nextValue.label,
      date: nextValue.date
    });
  }
  function handleConfirmCustomDate() {
    if (!draftDate) {
      return;
    }
    onValueChange({
      type: 'custom',
      label: format(draftDate, 'MMM d'),
      date: draftDate
    });
    setPickerOpen(false);
  }
  return (
    <>
      <Combobox
        items={dateOptions}
        value={activePreset}
        onValueChange={handleOptionChange}
        itemToStringValue={(item) => item.searchText}
        autoHighlight
      >
        <ComboboxTrigger
          render={
            <Button
              type='button'
              variant='outline'
              tone='neutral'
              className='w-full justify-between font-normal'
            />
          }
        >
          <DateTriggerLabel value={value} placeholder='Set start' />
        </ComboboxTrigger>

        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value={noDateOption}>
              <DateOptionRow option={noDateOption} />
            </ComboboxItem>
            <ComboboxSeparator />

            {presetOptions.map((option) => (
              <ComboboxItem key={option.id} value={option}>
                <DateOptionRow option={option} />
              </ComboboxItem>
            ))}

            <ComboboxSeparator />
            <ComboboxItem value={customDateOption}>
              <DateOptionRow option={customDateOption} />
            </ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className='flex w-auto max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden sm:max-w-none'>
          <DialogHeader>
            <DialogTitle>Pick a date</DialogTitle>
          </DialogHeader>

          <div className='py-3'>
            <Calendar
              mode='single'
              selected={draftDate}
              onSelect={setDraftDate}
              defaultMonth={draftDate ?? today}
              numberOfMonths={2}
              pagedNavigation
              showOutsideDays={false}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' size='sm'>
                Dismiss
              </Button>
            </DialogClose>
            <Button
              size='sm'
              onClick={handleConfirmCustomDate}
              disabled={!draftDate}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function Pattern() {
  const [startDate, setStartDate] = React.useState(null);
  return (
    <Field className='max-w-xs'>
      <DateSelectionCombobox value={startDate} onValueChange={setStartDate} />
    </Field>
  );
}
