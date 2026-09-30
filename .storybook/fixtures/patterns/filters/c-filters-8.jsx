'use client';
import { useState } from 'react';
import { Filters } from '../../../../src/components/core/FilterBar/parts/filters-extended.jsx';
import {
  createFilterQuery,
  createFilterRule
} from '../../../../src/components/core/FilterBar/parts/filters-query-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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
const fields = [
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
  }
];
export function Pattern() {
  const [query, setQuery] = useState(() =>
    createFilterQuery([
      createFilterRule({
        id: 'seed-1',
        path: ['channel'],
        operator: 'has_any_of',
        value: ['web', 'ios']
      }),
      createFilterRule({
        id: 'seed-2',
        path: ['plan'],
        operator: 'is',
        value: 'pro'
      }),
      createFilterRule({
        id: 'seed-3',
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
        id: 'seed-4',
        path: ['twoFactor'],
        operator: 'is',
        value: true
      })
    ])
  );
  return (
    <Filters fields={fields} query={query} onQueryChange={setQuery} showClear />
  );
}
