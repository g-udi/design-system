// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Filters } from '../../../../src/components/core/FilterBar/parts/filters-extended.jsx';
import {
  createFilterQuery,
  createFilterRule
} from '../../../../src/components/core/FilterBar/parts/filters-query-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const STATUSES = [
  {
    value: 'backlog',
    label: 'Backlog',
    dot: 'bg-zinc-400',
    badge:
      'border-zinc-500/20 bg-zinc-500/10 text-zinc-700 dark:border-zinc-400/25 dark:bg-zinc-400/15 dark:text-zinc-300'
  },
  {
    value: 'in-progress',
    label: 'In progress',
    dot: 'bg-amber-500',
    badge:
      'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/15 dark:text-amber-300'
  },
  {
    value: 'review',
    label: 'In review',
    dot: 'bg-sky-500',
    badge:
      'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/15 dark:text-sky-300'
  },
  {
    value: 'done',
    label: 'Done',
    dot: 'bg-emerald-500',
    badge:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/15 dark:text-emerald-300'
  },
  {
    value: 'shipped',
    label: 'Shipped',
    dot: 'bg-violet-500',
    badge:
      'border-violet-500/20 bg-violet-500/10 text-violet-700 dark:border-violet-400/25 dark:bg-violet-400/15 dark:text-violet-300'
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    dot: 'bg-rose-500',
    badge:
      'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/15 dark:text-rose-300'
  }
];
const PRIORITIES = [
  {
    value: 'low',
    label: 'Low',
    dot: 'bg-emerald-500',
    badge:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/15 dark:text-emerald-300'
  },
  {
    value: 'medium',
    label: 'Medium',
    dot: 'bg-yellow-500',
    badge:
      'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:border-yellow-400/25 dark:bg-yellow-400/15 dark:text-yellow-300'
  },
  {
    value: 'high',
    label: 'High',
    dot: 'bg-violet-500',
    badge:
      'border-violet-500/20 bg-violet-500/10 text-violet-700 dark:border-violet-400/25 dark:bg-violet-400/15 dark:text-violet-300'
  },
  {
    value: 'urgent',
    label: 'Urgent',
    dot: 'bg-orange-500',
    badge:
      'border-orange-500/20 bg-orange-500/10 text-orange-700 dark:border-orange-400/25 dark:bg-orange-400/15 dark:text-orange-300'
  },
  {
    value: 'critical',
    label: 'Critical',
    dot: 'bg-rose-500',
    badge:
      'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/15 dark:text-rose-300'
  }
];
const TONES = new Map(
  [...STATUSES, ...PRIORITIES].map((tone) => [tone.value, tone])
);
function Swatch({ tone }) {
  return <span className={cn('size-2.5 shrink-0 rounded-full', tone.dot)} />;
}
function toOptions(tones) {
  return tones.map((tone) => ({
    value: tone.value,
    label: tone.label,
    icon: <Swatch tone={tone} />
  }));
}
const BADGE_LIMIT = 2;
function BadgesOrStack({ options, fallback }) {
  if (options.length === 0) return <>{fallback}</>;
  if (options.length > BADGE_LIMIT) return <StackedDots options={options} />;
  return (
    <span className='flex items-center gap-2'>
      {options.map((option) => (
        <Badge
          key={option.value}
          variant='outline'
          className={cn(
            // The BOX the tint needs, stated here rather than inherited.
            // Seven styles give a badge `px-2 py-0.5` and this repeats their
            // values exactly, so it changes nothing in any of them. Sera is
            // the eighth: it strips a badge to bare type (`border-0 px-0 py-0`,
            // uppercase, letterspaced), which is right for a word and wrong for
            // a word with a fill behind it - the tint collapsed onto the
            // glyphs and two picks read as one two-tone smear. Padding is what
            // gives the fill a shape there, and it is the half of the old
            // treatment that survives every style. The other half did not: the
            // tone also coloured the outline variant's border, which sera sets
            // to zero width, so the hairline that was supposed to separate two
            // fills was painting nothing in exactly the style that needed it.
            // The `gap-2` above separates them instead, and it is a length no
            // style can take away.
            'px-2 py-0.5',
            TONES.get(option.value)?.badge
          )}
        >
          {option.label}
        </Badge>
      ))}
    </span>
  );
}
function StackedDots({ options }) {
  return (
    <span className='flex items-center gap-1.5'>
      <span className='flex items-center'>
        {options.slice(0, 4).map((option) => (
          <span
            key={option.value}
            className={cn(
              'ring-ui-background -ml-1 size-2.5 rounded-full ring-2 first:ml-0',
              TONES.get(option.value)?.dot ?? 'bg-ui-muted-foreground'
            )}
          />
        ))}
      </span>
      <span className='text-ui-muted-foreground text-xs tabular-nums'>
        {options.length}
      </span>
    </span>
  );
}
const fields = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    // `is_any_of` has arity "many", so the single-valued field still opens a
    // multi-select editor. Arity decides the editor, not the field's type.
    defaultOperator: 'is_any_of',
    options: toOptions(STATUSES),
    // Six rows read as colours, not as text, so a search box over them is
    // chrome. It is hidden rather than removed, so typing still narrows.
    searchable: false,
    renderValue: ({ options }) => (
      <BadgesOrStack options={options} fallback='any status' />
    ),
    icon: <RegistryIcon lucide='CircleDotIcon' />
  },
  {
    id: 'priority',
    label: 'Priority',
    type: 'multiselect',
    options: toOptions(PRIORITIES),
    searchable: false,
    renderValue: ({ options }) => (
      <BadgesOrStack options={options} fallback='any priority' />
    ),
    icon: <RegistryIcon lucide='FlagIcon' />
  },
  {
    id: 'title',
    label: 'Title',
    type: 'text',
    icon: <RegistryIcon lucide='TypeIcon' />
  }
];
export function Pattern() {
  const [query, setQuery] = useState(() =>
    createFilterQuery([
      // Five of the six statuses: everything that was not called off. Past the
      // badge limit, so this chip opens on the stack.
      createFilterRule({
        id: 'seed-1',
        path: ['status'],
        operator: 'is_any_of',
        value: ['backlog', 'in-progress', 'review', 'done', 'shipped']
      }),
      // Two, so the same renderer opens on badges. Both states are on screen
      // at once, and ticking a third priority switches this chip over.
      createFilterRule({
        id: 'seed-2',
        path: ['priority'],
        operator: 'has_any_of',
        value: ['urgent', 'critical']
      }),
      // "is not empty" carries arity "none", so this chip renders with no value
      // segment at all. Nothing special cases it: the operator says it takes no
      // value and the chip believes it.
      createFilterRule({
        id: 'seed-3',
        path: ['title'],
        operator: 'not_empty'
      })
    ])
  );
  return (
    <Filters fields={fields} query={query} onQueryChange={setQuery} showClear />
  );
}
