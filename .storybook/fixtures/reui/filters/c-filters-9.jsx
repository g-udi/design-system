// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useId, useState } from 'react';
import { Filters } from '../../../../src/components/core/FilterBar/parts/filters-extended.jsx';
import {
  createFilterQuery,
  createFilterRule
} from '../../../../src/components/core/FilterBar/parts/filters-query-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const asArray = (value) => (Array.isArray(value) ? value : []);
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
        id: 'seed-1',
        path: ['spend'],
        operator: 'between',
        value: [500, 2500]
      }),
      createFilterRule({
        id: 'seed-2',
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
        id: 'seed-3',
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
