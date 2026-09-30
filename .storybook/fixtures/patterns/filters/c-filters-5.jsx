'use client';
import { useState, useId } from 'react';
import { Filters } from '../../../../src/components/core/FilterBar/parts/filters-extended.jsx';
import {
  formatFilterDate,
  parseFilterDate,
  resolveFilterDate,
  toFilterDateValue
} from '../../../../src/components/core/FilterBar/parts/filters-date-extended.jsx';
import { createFilterQuery, createFilterRule } from '../../../../src/components/core/FilterBar/parts/filters-query-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { NativeSelect, NativeSelectOption } from '../../../../src/components/core/Select/parts/native-select.jsx';
import { RadioGroup, RadioGroupItem } from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '../../../../src/components/core/InputOtp/parts/input-otp.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';

// One filter bar whose fields each bring their own value editor. The editors
// are consumer components handed to the field schema; the bar only owns the
// chips, the operators and the query.
// ---- Dates: a single day and a range with presets.
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

// ---- Sliders: one editor for range and single-value operators.
const SCORE = {
  min: 0,
  max: 100,
  step: 1,
  format: (value) => String(value)
};
const PRICE = {
  min: 0,
  max: 5e3,
  step: 50,
  format: (value) => `$${value.toLocaleString()}`
};
function makeSliderEditor({ min, max, step, format }) {
  function SliderEditor({
    value,
    onValueChange,
    commit,
    cancel,
    labels,
    field,
    operator,
    autoFocusProps
  }) {
    const dual = operator.arity === 'range';
    const current = dual
      ? Array.isArray(value)
        ? value
        : [min, max]
      : typeof value === 'number'
        ? value
        : min;
    const reading = dual
      ? labels.valueRange(format(current[0]), format(current[1]))
      : format(current);
    const onKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        commit(current);
        return;
      }
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      cancel();
    };
    return (
      // `gap-2 p-2` is the primitive's own editor panel, and the width sits in
      // the band its built-ins use (w-56 for a number, w-64 for text), so the
      // popover does not resize between a shipped editor and this one.
      <div className='flex w-64 flex-col gap-2 p-2'>
        <div className='flex items-baseline justify-between gap-2'>
          <span className='text-ui-muted-foreground min-w-0 truncate text-xs font-medium'>
            {field.label}
          </span>
          {/* The one dark thing in the panel: the number being edited. */}
          <span className='shrink-0 text-sm font-medium tabular-nums'>
            {reading}
          </span>
        </div>

        {/*
          The bounds FLANK the track instead of sitting on a row of their own.
          They belong at the ends they name, the panel loses a row for it, and
          the only sizes left in the panel are then sm for the value and xs for
          everything that labels it.
        */}
        <div className='flex items-center gap-2'>
          <span className='text-ui-muted-foreground shrink-0 text-xs tabular-nums'>
            {format(min)}
          </span>
          <Slider
            {...autoFocusProps}
            className='min-w-0 flex-1'
            value={dual ? current : [current]}
            min={min}
            max={max}
            step={step}
            onValueChange={(next) => onValueChange(dual ? next : next[0])}
            onKeyDown={onKeyDown}
          />
          <span className='text-ui-muted-foreground shrink-0 text-xs tabular-nums'>
            {format(max)}
          </span>
        </div>

        <div className='flex items-center justify-end gap-1.5 pt-1'>
          <Button variant='ghost' size='sm' onClick={cancel}>
            {labels.discard}
          </Button>
          <Button size='sm' onClick={() => commit(current)}>
            {labels.apply}
          </Button>
        </div>
      </div>
    );
  }
  return SliderEditor;
}
function MiniTrack({ min, max, from, to }) {
  const span = max - min;
  const at = (value) =>
    span <= 0 || !Number.isFinite(value)
      ? 0
      : Math.min(Math.max((value - min) / span, 0), 1);
  const start = at(from);
  const end = Math.max(start, at(to));
  return (
    <span
      aria-hidden='true'
      className='bg-ui-muted relative inline-block h-1 w-8 shrink-0 rounded-control'
    >
      <span
        className='bg-ui-primary absolute inset-y-0 rounded-full'
        style={{ left: `${start * 100}%`, right: `${(1 - end) * 100}%` }}
      />
    </span>
  );
}
function readBand({ min, max, format }, { value, operator, labels }) {
  if (Array.isArray(value)) {
    const from = Number(value[0]);
    const to = Number(value[1]);
    return { from, to, text: labels.valueRange(format(from), format(to)) };
  }
  if (typeof value !== 'number') return null;
  const upward = operator.value === 'gte' || operator.value === 'gt';
  return {
    from: upward ? value : min,
    to: upward ? max : value,
    text: format(value)
  };
}
function makeSliderDisplay(scale, empty) {
  const { min, max, format } = scale;
  return {
    renderValue: (context) => {
      const band = readBand(scale, context);
      if (!band) return empty;
      return (
        <span className='flex items-center gap-1.5'>
          <MiniTrack min={min} max={max} from={band.from} to={band.to} />
          <span className='flex items-baseline gap-1'>
            <span className='tabular-nums'>{band.text}</span>
            {/*
          Dropped when the value already names the ceiling ("0 to 100"), so
          no chip ever prints one number twice - the same restraint that
          keeps a "+2" off a stack showing every face it has. A slash rather
          than a word, so the secondary text needs no label to translate.
        */}
            {band.text.includes(format(max)) ? null : (
              <span className='text-ui-muted-foreground text-xs tabular-nums'>
                / {format(max)}
              </span>
            )}
          </span>
        </span>
      );
    },
    valueText: (context) => readBand(scale, context)?.text ?? empty
  };
}
const ScoreSlider = makeSliderEditor(SCORE);
const scoreDisplay = makeSliderDisplay(SCORE, 'any score');
const PriceSlider = makeSliderEditor(PRICE);
const priceDisplay = makeSliderDisplay(PRICE, 'any amount');

// ---- Choice controls: toggle group, radios, checkboxes, a select and a switch.
const CHANNELS = [
  { value: 'web', label: 'Web' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'api', label: 'API' }
];
const PLANS = [
  { value: 'free', label: 'Free', hint: 'No card on file' },
  { value: 'pro', label: 'Pro', hint: 'Monthly or yearly' },
  { value: 'ultimate', label: 'Ultimate', hint: 'Seat based' }
];
const PERMISSIONS = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'publish', label: 'Publish' },
  { value: 'admin', label: 'Administer' },
  { value: 'billing', label: 'Billing' }
];
const REGIONS = [
  { value: 'emea', label: 'EMEA' },
  { value: 'amer', label: 'AMER' },
  { value: 'apac', label: 'APAC' },
  { value: 'latam', label: 'LATAM' }
];
const asArray = (value) => (Array.isArray(value) ? value : []);
const ROW =
  'hover:bg-ui-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 leading-normal font-normal';
function PickedLabels({ options, empty }) {
  if (options.length === 0) return <>{empty}</>;
  return (
    <span className='flex items-center gap-1.5'>
      {options[0].label}
      {options.length > 1 ? (
        <span className='text-ui-muted-foreground text-xs tabular-nums'>
          +{options.length - 1}
        </span>
      ) : null}
    </span>
  );
}
function ChannelToggles({ value, onValueChange, commit, field }) {
  const current = asArray(value);
  return (
    // No width: the group is `w-fit` and four short segments already decide how
    // wide the panel wants to be, so a fixed one could only be too much or too
    // little.
    <div className='p-2'>
      <ToggleGroup
        type='multiple'
        variant='outline'
        spacing={0}
        aria-label={field.label}
        value={current}
        onValueChange={(next) => {
          onValueChange(next);
          commit(next, { close: false });
        }}
      >
        {CHANNELS.map((channel) => (
          <ToggleGroupItem key={channel.value} value={channel.value}>
            {channel.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
function PlanRadios({ value, commit, field }) {
  return (
    <RadioGroup
      className='flex w-56 flex-col p-1'
      aria-label={field.label}
      value={typeof value === 'string' ? value : ''}
      onValueChange={(next) => commit(String(next))}
    >
      {PLANS.map((plan) => (
        // Top aligned, because the row is two lines and the control belongs
        // beside the first of them.
        <Label key={plan.value} className={cn(ROW, 'items-start')}>
          <RadioGroupItem value={plan.value} className='mt-0.5' />
          <span className='flex flex-col gap-0.5'>
            <span className='text-sm'>{plan.label}</span>
            <span className='text-ui-muted-foreground text-xs'>
              {plan.hint}
            </span>
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}
function PermissionChecks({ value, onValueChange, commit, labels }) {
  const current = asArray(value);
  const write = (next) => {
    onValueChange(next);
    commit(next, { close: false });
  };
  const toggle = (entry, checked) =>
    write(
      checked ? [...current, entry] : current.filter((item) => item !== entry)
    );
  return (
    <div className='flex w-56 flex-col p-1'>
      {PERMISSIONS.map((permission) => (
        <Label key={permission.value} className={ROW}>
          <Checkbox
            checked={current.includes(permission.value)}
            onCheckedChange={(checked) =>
              toggle(permission.value, checked === true)
            }
          />
          <span className='text-sm'>{permission.label}</span>
        </Label>
      ))}

      <div className='mt-1 flex items-center justify-between gap-2 border-t ps-2 pt-1'>
        <span className='text-ui-muted-foreground text-xs tabular-nums'>
          {labels.valueCount(current.length)}
        </span>
        <Button
          variant='ghost'
          size='sm'
          disabled={current.length === 0}
          onClick={() => write([])}
        >
          {labels.clear}
        </Button>
      </div>
    </div>
  );
}
function EnabledSwitch({ value, commit, field }) {
  const current = value === true;
  return (
    // `w-40` is the width the shipped boolean editor uses, and this is the same
    // filter that editor would have drawn, so the popover is the size the bar's
    // own True/False panel would have been.
    <Label className='flex w-40 cursor-pointer items-center justify-between gap-3 p-2 font-normal'>
      <span className='text-sm'>{field.label}</span>
      {/* One decisive value, so flipping it is the whole edit. */}
      <Switch
        checked={current}
        onCheckedChange={(checked) => commit(checked)}
        aria-label={field.label}
      />
    </Label>
  );
}
function RegionSelect({ value, commit, field }) {
  return (
    <div className='w-48 p-2'>
      <NativeSelect
        className='w-full'
        aria-label={field.label}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) =>
          commit(event.target.value === '' ? void 0 : event.target.value)
        }
      >
        <NativeSelectOption value=''>Any region</NativeSelectOption>
        {REGIONS.map((region) => (
          <NativeSelectOption key={region.value} value={region.value}>
            {region.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}

// ---- Typed values: an input group, a term list, code slots and a validated domain.
const toNumber = (raw) => {
  const parsed = Number(raw.replace(/,/g, ''));
  return raw.trim() === '' || Number.isNaN(parsed) ? void 0 : parsed;
};
const PANEL = 'flex w-64 flex-col gap-2 p-2';
const FOOTER = 'flex items-center justify-end gap-1.5 pt-1';
const HELPER = 'text-ui-muted-foreground text-xs';
function AmountEditor({
  value,
  onValueChange,
  commit,
  cancel,
  labels,
  field,
  operator,
  autoFocusProps
}) {
  const dual = operator.arity === 'range';
  const tuple = Array.isArray(value) ? value : [];
  const single = typeof value === 'number' ? value : void 0;
  const [from, setFrom] = useState(() =>
    dual ? String(tuple[0] ?? '') : String(single ?? '')
  );
  const [to, setTo] = useState(() => (dual ? String(tuple[1] ?? '') : ''));
  const draft = (low, high) => {
    if (!dual) return toNumber(low);
    const start = toNumber(low);
    const end = toNumber(high);
    return start === void 0 || end === void 0 ? void 0 : [start, end];
  };
  const money = (children) => (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      {children}
      <InputGroupAddon align='inline-end'>
        {/* No type overrides on either addon: `InputGroupText` is already the
       muted, input-sized treatment, and shrinking one of the two made the
       unit read as a footnote beside its own currency. */}
        <InputGroupText>/mo</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit(draft(from, to));
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      cancel();
    }
  };
  return (
    <div className={PANEL}>
      {money(
        <InputGroupInput
          {...autoFocusProps}
          inputMode='decimal'
          value={from}
          aria-label={dual ? labels.rangeFrom(field.label) : field.label}
          placeholder={field.placeholder}
          onChange={(event) => {
            setFrom(event.target.value);
            onValueChange(draft(event.target.value, to));
          }}
          onKeyDown={onKeyDown}
        />
      )}

      {dual ? (
        <>
          <span className={cn(HELPER, 'ps-1')}>{labels.rangeSeparator}</span>
          {money(
            <InputGroupInput
              inputMode='decimal'
              value={to}
              aria-label={labels.rangeTo(field.label)}
              onChange={(event) => {
                setTo(event.target.value);
                onValueChange(draft(from, event.target.value));
              }}
              onKeyDown={onKeyDown}
            />
          )}
        </>
      ) : null}

      <div className={FOOTER}>
        <Button variant='ghost' size='sm' onClick={cancel}>
          {labels.discard}
        </Button>
        <Button size='sm' onClick={() => commit(draft(from, to))}>
          {labels.apply}
        </Button>
      </div>
    </div>
  );
}
function KeywordList({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  labels,
  field
}) {
  const current = asArray(value);
  const [text, setText] = useState(() => current.join('\n'));
  const hintId = useId();
  const parse = (raw) =>
    raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  return (
    <div className={PANEL}>
      <Textarea
        {...autoFocusProps}
        rows={4}
        value={text}
        aria-label={field.label}
        aria-describedby={hintId}
        placeholder={field.placeholder}
        onChange={(event) => {
          setText(event.target.value);
          onValueChange(parse(event.target.value));
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            commit(parse(text));
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            cancel();
          }
        }}
      />
      {/* On its own line rather than squeezed in beside the buttons. The pair
       is as wide as its longest translation, so a rule sharing that row is
       one long word away from wrapping under it. */}
      <span id={hintId} className={HELPER}>
        One per line
      </span>
      <div className={FOOTER}>
        <Button variant='ghost' size='sm' onClick={cancel}>
          {labels.discard}
        </Button>
        <Button size='sm' onClick={() => commit(parse(text))}>
          {labels.apply}
        </Button>
      </div>
    </div>
  );
}
function AccessCodeEditor({
  value,
  onValueChange,
  commit,
  field,
  autoFocusProps
}) {
  return (
    <div className='p-2'>
      <InputOTP
        {...autoFocusProps}
        maxLength={6}
        value={typeof value === 'string' ? value : ''}
        aria-label={field.label}
        inputMode='text'
        pattern='^[a-zA-Z0-9]*$'
        onChange={(next) => onValueChange(next.toUpperCase())}
        onComplete={(next) => commit(next.toUpperCase())}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
const DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i;
function DomainEditor({
  value,
  onValueChange,
  commit,
  cancel,
  labels,
  field,
  autoFocusProps
}) {
  const [text, setText] = useState(() =>
    typeof value === 'string' ? value : ''
  );
  const hintId = useId();
  const invalid = text.trim() !== '' && !DOMAIN.test(text.trim());
  const submit = () => {
    if (invalid || text.trim() === '') return;
    commit(text.trim().toLowerCase());
  };
  return (
    <div className={PANEL}>
      <Input
        {...autoFocusProps}
        value={text}
        aria-label={field.label}
        aria-invalid={invalid}
        aria-describedby={hintId}
        placeholder={field.placeholder}
        onChange={(event) => {
          setText(event.target.value);
          onValueChange(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            submit();
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            cancel();
          }
        }}
      />
      {/* Under the field it judges, which is where a form error belongs, and
       `aria-describedby` so the rejection is spoken rather than only
       coloured. The line is a live region rather than a `role="alert"` that
       appears with the error: a region that is always mounted announces the
       CHANGE from the example to the complaint, where a role toggled onto a
       node that was already there is not reliably picked up at all. */}
      <span
        id={hintId}
        aria-live='polite'
        className={cn(HELPER, invalid && 'text-ui-destructive')}
      >
        {invalid ? 'Needs a dot, as in acme.com' : 'example.com'}
      </span>
      <div className={FOOTER}>
        <Button variant='ghost' size='sm' onClick={cancel}>
          {labels.discard}
        </Button>
        <Button size='sm' disabled={invalid} onClick={submit}>
          {labels.apply}
        </Button>
      </div>
    </div>
  );
}

const fields = [
  // Dates: a single day and a range with presets.
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
  ),
  // Sliders: one editor for range and single-value operators.
  {
    id: 'score',
    label: 'Health score',
    type: 'range',
    defaultOperator: 'between',
    // A component, so no registration is needed. A string here would look the
    // editor up in the `editors` map instead, and a concrete editor assigns
    // directly: `FilterEditorRef` widens for it.
    editor: ScoreSlider,
    renderValue: scoreDisplay.renderValue,
    valueText: scoreDisplay.valueText,
    icon: <RegistryIcon lucide='ActivityIcon' />
  },
  {
    id: 'mrr',
    label: 'Monthly spend',
    type: 'number',
    // Single-value operators, so the same editor renders one thumb.
    defaultOperator: 'gte',
    editor: PriceSlider,
    renderValue: priceDisplay.renderValue,
    valueText: priceDisplay.valueText,
    icon: <RegistryIcon lucide='BanknoteIcon' />
  },
  {
    id: 'account',
    label: 'Account',
    type: 'text',
    icon: <RegistryIcon lucide='Building2Icon' />
  },
  // Choice controls: toggle group, radios, checkboxes, a select and a switch.
  {
    id: 'channel',
    label: 'Channel',
    type: 'multiselect',
    // The options still ship, even though the editor draws its own rows: they
    // are what the chip resolves a stored value's LABEL from.
    options: CHANNELS,
    editor: ChannelToggles,
    renderValue: ({ options }) => (
      <PickedLabels options={options} empty='any channel' />
    ),
    icon: <RegistryIcon lucide='MonitorSmartphoneIcon' />
  },
  {
    id: 'plan',
    label: 'Plan',
    type: 'select',
    options: PLANS.map((plan) => ({ value: plan.value, label: plan.label })),
    editor: PlanRadios,
    icon: <RegistryIcon lucide='CreditCardIcon' />
  },
  {
    id: 'permissions',
    label: 'Permissions',
    type: 'multiselect',
    options: PERMISSIONS,
    editor: PermissionChecks,
    renderValue: ({ options }) => (
      <PickedLabels options={options} empty='any permission' />
    ),
    icon: <RegistryIcon lucide='ShieldCheckIcon' />
  },
  {
    id: 'region',
    label: 'Region',
    type: 'select',
    options: REGIONS,
    editor: RegionSelect,
    icon: <RegistryIcon lucide='GlobeIcon' />
  },
  {
    id: 'twoFactor',
    // The short form, because a chip is a row of them. Spelled out, this chip
    // is 60px wider, and the four of them clear the bar by 64 in sera, so the
    // long form is the difference between a row and a wrap. The acronym is what
    // a filter list would call it anyway.
    label: '2FA',
    type: 'boolean',
    editor: EnabledSwitch,
    renderValue: ({ value }) => (value === true ? 'on' : 'off'),
    icon: <RegistryIcon lucide='KeyRoundIcon' />
  },
  // Typed values: an input group, a term list, code slots and a validated domain.
  {
    id: 'spend',
    label: 'Monthly spend',
    type: 'number',
    // Ships with a range operator selected, so the editor opens as two groups.
    defaultOperator: 'between',
    placeholder: '0',
    editor: AmountEditor,
    renderValue: ({ value, labels }) =>
      Array.isArray(value)
        ? labels.valueRange(
            `$${Number(value[0]).toLocaleString()}`,
            `$${Number(value[1]).toLocaleString()}`
          )
        : typeof value === 'number'
          ? `$${value.toLocaleString()}`
          : 'any amount',
    icon: <RegistryIcon lucide='BanknoteIcon' />
  },
  {
    id: 'keywords',
    label: 'Keywords',
    type: 'multiselect',
    defaultOperator: 'has_any_of',
    placeholder: 'onboarding\nchurn\nrenewal',
    editor: KeywordList,
    // The first term, plus what it stands in for. A pasted list collapses to
    // "5 selected" by default, which names none of them; the leading term with
    // an overflow count beside it is the same treatment c-filters-1 gives a
    // stack of people, and it fits in the same space.
    renderValue: ({ values }) =>
      values.length === 0 ? (
        'none'
      ) : (
        <span className='flex items-center gap-1.5'>
          {String(values[0])}
          {values.length > 1 ? (
            <span className='text-ui-muted-foreground text-xs tabular-nums'>
              +{values.length - 1}
            </span>
          ) : null}
        </span>
      ),
    icon: <RegistryIcon lucide='TagsIcon' />
  },
  {
    id: 'accessCode',
    label: 'Access code',
    type: 'text',
    // Only the two operators a fixed width code can answer. A `contains` on a
    // six character code would be a filter nobody means.
    operators: [
      { value: 'is', label: 'is', inverse: 'is_not' },
      { value: 'is_not', label: 'is not', inverse: 'is' }
    ],
    defaultOperator: 'is',
    editor: AccessCodeEditor,
    renderValue: ({ value }) =>
      typeof value === 'string' && value ? (
        <span className='font-mono tracking-wider'>{value}</span>
      ) : (
        'any code'
      ),
    icon: <RegistryIcon lucide='KeyRoundIcon' />
  },
  {
    id: 'domain',
    label: 'Domain',
    type: 'text',
    defaultOperator: 'is',
    placeholder: 'acme.com',
    editor: DomainEditor,
    icon: <RegistryIcon lucide='GlobeIcon' />
  }
];
export function Pattern() {
  const [query, setQuery] = useState(() =>
    createFilterQuery([
      createFilterRule({
        id: 'seed-5-1',
        path: ['window'],
        operator: 'between',
        value: [
          { relative: { unit: 'day', offset: -6 } },
          { relative: { unit: 'day', offset: 0 } }
        ]
      }),
      createFilterRule({
        id: 'seed-6-1',
        path: ['score'],
        operator: 'between',
        value: [30, 70]
      }),
      createFilterRule({
        id: 'seed-8-1',
        path: ['channel'],
        operator: 'has_any_of',
        value: ['web', 'ios']
      }),
      createFilterRule({
        id: 'seed-8-2',
        path: ['plan'],
        operator: 'is',
        value: 'pro'
      }),
      createFilterRule({
        id: 'seed-8-3',
        path: ['region'],
        operator: 'is',
        value: 'emea'
      }),
      /*
              FOUR chips, and the fourth is the last one that fits.

              Five editors are on show, and seeding one chip each is the obvious
              thing: every editor would then be one press away. It does not fit, and
              the way it fails is worse than the click it saves. The bar is a wrapping
              row whose chips live in an inner toolbar, and a flex child that wraps
              internally claims the full width of its line, so the moment the fifth
              chip goes to a second row the toolbar owns BOTH rows and pushes Add
              filter and Clear onto a third - the trigger at the far left, Clear at
              the far right, a thousand pixels of nothing between them.

              Measured at the width a catalog card gives this bar (1128px), the five
              chips run 1172 to 1336 depending on the style against a budget of 977 to
              1036. No arrangement of five fits and no wording closes a 300px gap, so
              the count is the thing that gives. Two of the five drops leave a row that
              fits; this one clears sera by 64px where dropping Channel clears it by
              15, and it costs the least besides, because Permissions drew the same
              `PickedLabels` display the Channel chip already shows - and shows better,
              since Channel carries the overflow count too. Its editor is reachable
              from Add filter like any other field.
            */
      createFilterRule({
        id: 'seed-8-4',
        path: ['twoFactor'],
        operator: 'is',
        value: true
      }),
      createFilterRule({
        id: 'seed-9-1',
        path: ['spend'],
        operator: 'between',
        value: [500, 2500]
      }),
      createFilterRule({
        id: 'seed-9-2',
        path: ['accessCode'],
        operator: 'is',
        value: 'R7K2QX'
      }),
      /*
              THREE chips, not four, and the arithmetic decides which three.

              The bar is a wrapping row whose chips sit in an inner toolbar, and a
              flex child that wraps internally claims its whole line, so a fourth chip
              that spills does not simply take a second row: it hands the toolbar both
              rows and strands Add filter and Clear alone on a third. At the width a
              catalog card gives this bar (1128px) the four chips run 1164 to 1314
              across the styles, against a budget of 977 to 1036.

              Keywords is the one that goes, and the arithmetic picks it rather than
              taste. Spend is the widest chip in every style, but it is the input
              group this example leads with, so it stays and one of the other three
              goes. Only dropping Keywords clears the budget in all eight: spend, code
              and domain run 839 to 943. Keeping Keywords instead wraps in four styles
              (with domain) or six (with code). Its editor and its overflow display
              are one press of Add filter away.
            */
      createFilterRule({
        id: 'seed-9-3',
        path: ['domain'],
        operator: 'is',
        value: 'acme.com'
      })
    ])
  );
  return (
    <Filters fields={fields} query={query} onQueryChange={setQuery} showClear />
  );
}
