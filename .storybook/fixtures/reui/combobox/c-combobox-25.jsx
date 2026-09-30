// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger
} from '../../../../src/components/core/Select/parts/combobox.jsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const noDateOption = {
  type: 'none',
  id: 'no-date',
  label: 'No date',
  searchText: 'No date clear date remove date empty'
};
const customDateOption = {
  type: 'custom',
  id: 'custom-date',
  label: 'Custom date...',
  searchText: 'Custom date custom day calendar picker choose a date manual date'
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
        <CalendarGlyph className='text-ui-muted-foreground' />
        <span className='text-ui-muted-foreground truncate'>{placeholder}</span>
      </span>
    );
  }
  const displayLabel =
    value.type === 'custom' ? format(value.date, 'MMM d') : value.label;
  return (
    <span className='flex min-w-0 items-center gap-2'>
      <CalendarGlyph className='text-ui-muted-foreground' />
      <span className='truncate'>{displayLabel}</span>
    </span>
  );
}
function DateOptionRow({ option }) {
  if (option.type === 'none') {
    return (
      <span className='flex min-w-0 items-center gap-2'>
        <CalendarGlyph className='text-ui-muted-foreground' />
        <span className='truncate'>{option.label}</span>
      </span>
    );
  }
  if (option.type === 'custom') {
    return (
      <span className='flex min-w-0 items-center gap-2'>
        <CalendarSearchGlyph className='text-ui-muted-foreground' />
        <span className='truncate'>{option.label}</span>
      </span>
    );
  }
  return (
    <span className='flex w-full min-w-0 items-center justify-between gap-3'>
      <span className='flex min-w-0 items-center gap-2'>
        <CalendarGlyph className='text-ui-muted-foreground' />
        <span className='truncate'>{option.label}</span>
      </span>
      <span className='text-ui-muted-foreground shrink-0 text-sm tabular-nums'>
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
  const today = React.useMemo(() => startOfDay(/* @__PURE__ */ new Date()), []);
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
        searchText: 'Tomorrow next day due date'
      },
      {
        type: 'preset',
        id: 'end-of-week',
        label: 'End of week',
        date: getUpcomingWeekEnd(today),
        searchText: 'End of week Sunday week close target'
      },
      {
        type: 'preset',
        id: 'in-one-week',
        label: 'In one week',
        date: addWeeks(today, 1),
        searchText: 'In one week next week seven days target'
      },
      {
        type: 'preset',
        id: 'end-of-month',
        label: 'End of month',
        date: getUpcomingMonthEnd(today),
        searchText: 'End of month month close month end target'
      },
      {
        type: 'preset',
        id: 'in-one-month',
        label: 'In one month',
        date: addMonths(today, 1),
        searchText: 'In one month next month thirty days target'
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
              className='w-full justify-between font-normal'
            />
          }
        >
          <DateTriggerLabel value={value} placeholder='Set start' />
        </ComboboxTrigger>

        <ComboboxContent className='max-w-(--anchor-width) min-w-(--anchor-width)'>
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
