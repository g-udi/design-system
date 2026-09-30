// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Filters } from '../../../../src/components/core/FilterBar/parts/filters-extended.jsx';
import {
  formatFilterDate,
  parseFilterDate,
  resolveFilterDate,
  toFilterDateValue
} from '../../../../src/components/core/FilterBar/parts/filters-date-extended.jsx';
import {
  createFilterQuery,
  createFilterRule
} from '../../../../src/components/core/FilterBar/parts/filters-query-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const isRange = (value) => Array.isArray(value);
const DAY_GRID =
  'p-0 [--cell-size:--spacing(7)] [&_.rdp-month]:gap-2 [&_tbody_tr]:mt-1';
function SingleDateBody({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  field
}) {
  const current = isRange(value) ? value[0] : value;
  const [text, setText] = useState(() => formatFilterDate(current));
  const selected = resolveFilterDate(current) ?? void 0;
  return (
    <div className='flex flex-col gap-2 p-2'>
      <Input
        {...autoFocusProps}
        value={text}
        placeholder='today, next friday...'
        aria-label={field.label}
        onChange={(event) => {
          setText(event.target.value);
          const parsed = parseFilterDate(event.target.value);
          if (parsed) onValueChange(parsed);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit(parseFilterDate(text) ?? current);
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            cancel();
          }
        }}
      />

      <Calendar
        mode='single'
        className={DAY_GRID}
        selected={selected}
        defaultMonth={selected}
        onSelect={(date) => {
          if (date) commit(toFilterDateValue(date));
        }}
      />
    </div>
  );
}
const RANGE_PRESETS = [
  [
    'Last 7 days',
    [
      { relative: { unit: 'day', offset: -6 } },
      { relative: { unit: 'day', offset: 0 } }
    ]
  ],
  [
    'Last 30 days',
    [
      { relative: { unit: 'day', offset: -29 } },
      { relative: { unit: 'day', offset: 0 } }
    ]
  ]
];
function DateRangeBody({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  labels
}) {
  const tuple = isRange(value) ? value : void 0;
  const from = resolveFilterDate(tuple?.[0]) ?? void 0;
  const to = resolveFilterDate(tuple?.[1]) ?? void 0;
  return (
    <div className='flex flex-col gap-2 p-2'>
      <div className='grid grid-cols-2 gap-1.5'>
        {RANGE_PRESETS.map(([label, preset], index) => (
          <Button
            key={label}
            {...(index === 0 ? autoFocusProps : {})}
            variant='outline'
            size='sm'
            onClick={() => commit(preset)}
          >
            {label}
          </Button>
        ))}
      </div>

      <Calendar
        mode='range'
        numberOfMonths={2}
        className={DAY_GRID}
        selected={{ from, to }}
        defaultMonth={from}
        onSelect={(range) => {
          if (!range?.from) return;
          onValueChange([
            toFilterDateValue(range.from),
            toFilterDateValue(range.to ?? range.from)
          ]);
        }}
      />

      {/*
      A range keeps its confirm, for the reason the primitive's own range
      editor gives: it takes TWO clicks to say, and a panel that closed on the
      first one would commit a bound the user had not finished choosing. The
      rule is bled to the panel edge because a calendar sits above it.
    */}
      <div className='-mx-2 flex items-center justify-end gap-1.5 border-t px-2 pt-2'>
        <Button variant='ghost' size='sm' onClick={cancel}>
          {labels.discard}
        </Button>
        <Button size='sm' disabled={!tuple} onClick={() => commit()}>
          {labels.apply}
        </Button>
      </div>
    </div>
  );
}
function DateEditor(props) {
  return props.operator.arity === 'range' ? (
    <DateRangeBody {...props} />
  ) : (
    <SingleDateBody {...props} />
  );
}
const dateOperators = [
  { value: 'is', label: 'is', inverse: 'is_not' },
  { value: 'is_not', label: 'is not', inverse: 'is' },
  { value: 'is_before', label: 'is before', inverse: 'is_on_or_after' },
  { value: 'is_after', label: 'is after', inverse: 'is_on_or_before' },
  { value: 'is_on_or_before', label: 'is on or before', inverse: 'is_after' },
  { value: 'is_on_or_after', label: 'is on or after', inverse: 'is_before' },
  {
    value: 'between',
    label: 'is between',
    arity: 'range',
    inverse: 'not_between'
  },
  {
    value: 'not_between',
    label: 'is not between',
    arity: 'range',
    inverse: 'between'
  },
  { value: 'empty', label: 'is empty', arity: 'none', inverse: 'not_empty' },
  {
    value: 'not_empty',
    label: 'is not empty',
    arity: 'none',
    inverse: 'empty'
  }
];
const dateText = (value, valueRange) => {
  const typed = value;
  if (isRange(typed)) {
    return valueRange(formatFilterDate(typed[0]), formatFilterDate(typed[1]));
  }
  return formatFilterDate(typed) || 'Select time';
};
const dateField = (id, label, defaultOperator, icon) => ({
  id,
  label,
  operators: dateOperators,
  defaultOperator,
  // A component, assignable directly: `FilterEditorRef` accepts a concrete
  // editor on an unknown-typed field.
  editor: DateEditor,
  // The chip shows the PHRASE, so "today" keeps saying today rather than
  // freezing to the day the filter was made.
  renderValue: ({ value, labels }) => dateText(value, labels.valueRange),
  // And the same phrase as TEXT, which is what the accessible names, the
  // titles and the advanced builder's cell read. Required alongside a
  // `renderValue` whenever the stored value does not stringify.
  valueText: ({ value, labels }) => dateText(value, labels.valueRange),
  icon
});
const fields = [
  dateField(
    'createdAt',
    'Created',
    'is',
    <RegistryIcon lucide='CalendarIcon' />
  ),
  dateField(
    'window',
    'Active window',
    'between',
    <RegistryIcon lucide='CalendarRangeIcon' />
  )
];
export function Pattern() {
  const [query, setQuery] = useState(() =>
    createFilterQuery([
      createFilterRule({
        id: 'seed-1',
        path: ['window'],
        operator: 'between',
        value: [
          { relative: { unit: 'day', offset: -6 } },
          { relative: { unit: 'day', offset: 0 } }
        ]
      })
    ])
  );
  return (
    <Filters fields={fields} query={query} onQueryChange={setQuery} showClear />
  );
}
