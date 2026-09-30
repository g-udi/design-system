// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Filters } from '../../../../src/components/core/FilterBar/parts/filters-extended.jsx';
import {
  createFilterQuery,
  createFilterRule
} from '../../../../src/components/core/FilterBar/parts/filters-query-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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
const fields = [
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
  }
];
export function Pattern() {
  const [query, setQuery] = useState(() =>
    createFilterQuery([
      createFilterRule({
        id: 'seed-1',
        path: ['score'],
        operator: 'between',
        value: [30, 70]
      })
    ])
  );
  return (
    <Filters fields={fields} query={query} onQueryChange={setQuery} showClear />
  );
}
