'use client';
import { useMemo, useState } from 'react';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridPagination } from '../../../../src/components/core/DataTable/parts/data-grid-pagination-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import { DataGridTable } from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import { Filters } from '../../../../src/components/core/FilterBar/parts/filters-extended.jsx';
import {
  createFilterQuery,
  createFilterRule,
  isFilterRule
} from '../../../../src/components/core/FilterBar/parts/filters-query-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
function Dot({ className }) {
  return <span className={cn('size-2 shrink-0 rounded-full', className)} />;
}
function Star({ className }) {
  return (
    <RegistryIcon
      lucide='StarIcon'
      className={cn('shrink-0 **:text-inherit!', className)}
    />
  );
}
function Flag({ code, className }) {
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt=''
      className={cn('size-4 shrink-0 rounded-full object-cover', className)}
    />
  );
}
const STATUSES = [
  { value: 'active', label: 'Active', dot: 'bg-emerald-500' },
  { value: 'invited', label: 'Invited', dot: 'bg-sky-500' },
  { value: 'suspended', label: 'Suspended', dot: 'bg-rose-500' }
];
const AVAILABILITIES = [
  { value: 'online', label: 'Online', dot: 'bg-emerald-500' },
  { value: 'away', label: 'Away', dot: 'bg-amber-500' },
  { value: 'busy', label: 'Busy', dot: 'bg-rose-500' },
  { value: 'offline', label: 'Offline', dot: 'bg-zinc-400' }
];
const PRIORITIES = [
  { value: 'low', label: 'Low', star: 'text-emerald-500!' },
  { value: 'medium', label: 'Medium', star: 'text-yellow-500!' },
  { value: 'high', label: 'High', star: 'text-orange-500!' },
  { value: 'urgent', label: 'Urgent', star: 'text-rose-500!' }
];
const ROLES = [
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Data Scientist', label: 'Data Scientist' },
  { value: 'Designer', label: 'Designer' },
  { value: 'Developer', label: 'Developer' }
];
const DOTS = new Map(
  [...STATUSES, ...AVAILABILITIES].map((tone) => [tone.value, tone.dot])
);
const STAFF = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@apple.com',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Product Manager',
    priority: 'urgent',
    status: 'active',
    availability: 'online',
    location: 'United States',
    flag: 'us'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@openai.com',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Data Scientist',
    priority: 'high',
    status: 'active',
    availability: 'away',
    location: 'United Kingdom',
    flag: 'gb'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael@meta.com',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    role: 'Designer',
    priority: 'medium',
    status: 'invited',
    availability: 'busy',
    location: 'Canada',
    flag: 'ca'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@tesla.com',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    role: 'Developer',
    priority: 'low',
    status: 'suspended',
    availability: 'offline',
    location: 'Australia',
    flag: 'au'
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@sap.com',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    role: 'Developer',
    priority: 'high',
    status: 'active',
    availability: 'online',
    location: 'Germany',
    flag: 'de'
  },
  {
    id: '6',
    name: 'Aron Thompson',
    email: 'aron@northwind.dev',
    avatar:
      'https://randomuser.me/api/portraits/men/75.jpg',
    role: 'Designer',
    priority: 'medium',
    status: 'active',
    availability: 'away',
    location: 'Malaysia',
    flag: 'my'
  },
  {
    id: '7',
    name: 'James Brown',
    email: 'james@bbva.es',
    avatar:
      'https://randomuser.me/api/portraits/men/54.jpg',
    role: 'Product Manager',
    priority: 'low',
    status: 'invited',
    availability: 'busy',
    location: 'Spain',
    flag: 'es'
  },
  {
    id: '8',
    name: 'Maria Garcia',
    email: 'maria@sony.jp',
    avatar:
      'https://randomuser.me/api/portraits/women/90.jpg',
    role: 'Data Scientist',
    priority: 'urgent',
    status: 'active',
    availability: 'offline',
    location: 'Japan',
    flag: 'jp'
  },
  {
    id: '9',
    name: 'Nick Johnson',
    email: 'nick@lvmh.fr',
    avatar:
      'https://randomuser.me/api/portraits/women/12.jpg',
    role: 'Developer',
    priority: 'medium',
    status: 'active',
    availability: 'online',
    location: 'France',
    flag: 'fr'
  },
  {
    id: '10',
    name: 'Liam Thompson',
    email: 'liam@eni.it',
    avatar:
      'https://randomuser.me/api/portraits/women/65.jpg',
    role: 'Designer',
    priority: 'low',
    status: 'suspended',
    availability: 'away',
    location: 'Italy',
    flag: 'it'
  },
  {
    id: '11',
    name: 'Olivia Martinez',
    email: 'olivia@vale.br',
    avatar:
      'static/images/art/11.svg',
    role: 'Data Scientist',
    priority: 'high',
    status: 'active',
    availability: 'busy',
    location: 'Brazil',
    flag: 'br'
  },
  {
    id: '12',
    name: 'Ethan Park',
    email: 'ethan@tata.in',
    avatar:
      'static/images/art/5.svg',
    role: 'Product Manager',
    priority: 'medium',
    status: 'invited',
    availability: 'online',
    location: 'India',
    flag: 'in'
  }
];
const LOCATIONS = Array.from(
  new Map(
    STAFF.map((person) => [
      person.location,
      {
        value: person.location,
        label: person.location,
        icon: <Flag code={person.flag} />
      }
    ])
  ).values()
);
function StackedDots({ options, empty }) {
  if (options.length === 0) return <>{empty}</>;
  if (options.length === 1) {
    return (
      <span className='flex items-center gap-1.5'>
        <Dot
          className={DOTS.get(options[0].value) ?? 'bg-ui-muted-foreground'}
        />
        {options[0].label}
      </span>
    );
  }
  return (
    <span className='flex items-center gap-1.5'>
      <span className='flex items-center'>
        {options.slice(0, 4).map((option) => (
          <span
            key={option.value}
            className={cn(
              'ring-ui-background -ml-1 size-2.5 rounded-full ring-2 first:ml-0',
              DOTS.get(option.value) ?? 'bg-ui-muted-foreground'
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
function StackedStars({ options }) {
  if (options.length === 0) return <>any priority</>;
  if (options.length === 1) {
    const only = PRIORITIES.find((entry) => entry.value === options[0].value);
    return (
      <span className='flex items-center gap-1.5'>
        <Star
          className={cn('size-3.5', only?.star ?? 'text-ui-muted-foreground')}
        />
        {options[0].label}
      </span>
    );
  }
  return (
    <span className='flex items-center gap-1.5'>
      <span className='flex items-center'>
        {options.slice(0, 4).map((option) => {
          const entry = PRIORITIES.find(
            (candidate) => candidate.value === option.value
          );
          return (
            <Star
              key={option.value}
              className={cn(
                '-ml-0.5 size-3.5 first:ml-0',
                entry?.star ?? 'text-ui-muted-foreground'
              )}
            />
          );
        })}
      </span>
      <span className='text-ui-muted-foreground text-xs tabular-nums'>
        {options.length}
      </span>
    </span>
  );
}
const fields = [
  {
    id: 'staff',
    label: 'Staff',
    type: 'text',
    icon: <RegistryIcon lucide='UserRoundIcon' />
  },
  {
    id: 'role',
    label: 'Occupation',
    type: 'select',
    // Arity, not the field's type, is what opens a multi-select editor: `is any
    // of` takes many values, so a `select` field edits as a checklist under it.
    defaultOperator: 'is_any_of',
    options: ROLES,
    // Four rows are read, not searched. The input is hidden rather than
    // removed: it owns focus and `aria-activedescendant`, so taking it out
    // would take the keyboard with it, and typing still narrows the list.
    searchable: false,
    icon: <RegistryIcon lucide='BriefcaseBusinessIcon' />
  },
  {
    // A person has ONE priority, so this is a select whose VALUE happens to be
    // a list: `is any of` asks a question about that single rank, where the
    // `has any of` a multiselect would default to asks about a set the row does
    // not have.
    id: 'priority',
    label: 'Priority',
    type: 'select',
    defaultOperator: 'is_any_of',
    options: PRIORITIES.map((tone) => ({
      value: tone.value,
      label: tone.label,
      icon: <Star className={cn('size-3.5', tone.star)} />
    })),
    // No `searchable` key, so the search box stays. Four ranks are few enough
    // to read, so this is the treatment on show rather than a necessity:
    // Occupation, Status and Availability all hide their box, and Priority and
    // Location are what keep the other half of that choice visible.
    //
    // And a box that stays gets a word of its own instead of the generic
    // "Search...". The primitive will not compose one: a built in
    // `Search ${label}...` is hardcoded English no `labels` override can reach,
    // and lowercasing a label is locale hostile besides (Turkish dotted i,
    // German nouns), so the wording belongs to the schema.
    placeholder: 'Search priority...',
    renderValue: ({ options }) => <StackedStars options={options} />,
    icon: <RegistryIcon lucide='StarIcon' />
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    defaultOperator: 'is_any_of',
    options: STATUSES.map((tone) => ({
      value: tone.value,
      label: tone.label,
      icon: <Dot className={tone.dot} />
    })),
    searchable: false,
    renderValue: ({ options }) => (
      <StackedDots options={options} empty='any status' />
    ),
    icon: <RegistryIcon lucide='CircleDotIcon' />
  },
  {
    id: 'availability',
    label: 'Availability',
    type: 'select',
    defaultOperator: 'is_any_of',
    options: AVAILABILITIES.map((tone) => ({
      value: tone.value,
      label: tone.label,
      icon: <Dot className={tone.dot} />
    })),
    searchable: false,
    renderValue: ({ options }) => (
      <StackedDots options={options} empty='any availability' />
    ),
    icon: <RegistryIcon lucide='WifiIcon' />
  },
  {
    id: 'location',
    label: 'Location',
    type: 'select',
    defaultOperator: 'is_any_of',
    // Twelve countries, so this one keeps its search box: a list that long is
    // typed at rather than scanned.
    options: LOCATIONS,
    placeholder: 'Search locations...',
    // A country list carries no order of its own, unlike the ladders above, so
    // it is the one field here that asks for alphabetical.
    //
    // `sortSelected` stands on its own: this field does not set `pinSelected`,
    // so there is one group and the whole menu reads A to Z. On a field that
    // did stack its picks, the same setting would order each group instead.
    // The ladders keep their schema order either way: sorting one would print
    // Low, Medium, High, Urgent as High, Low, Medium, Urgent, and destroy the
    // only thing the rank had going for it.
    sortSelected: 'label',
    icon: <RegistryIcon lucide='GlobeIcon' />
  }
];
function readField(row, path) {
  if (path === 'staff') return `${row.name} ${row.email}`;
  return row[path];
}
function matchesRule(row, rule) {
  const actual = readField(row, rule.path[0]);
  const value = rule.value;
  const result = (() => {
    switch (rule.operator) {
      case 'contains':
        return String(actual)
          .toLowerCase()
          .includes(String(value).toLowerCase());
      case 'not_contains':
        return !String(actual)
          .toLowerCase()
          .includes(String(value).toLowerCase());
      case 'starts_with':
        return String(actual)
          .toLowerCase()
          .startsWith(String(value).toLowerCase());
      case 'ends_with':
        return String(actual)
          .toLowerCase()
          .endsWith(String(value).toLowerCase());
      case 'is':
      case 'eq':
        return String(actual) === String(value);
      case 'is_not':
      case 'neq':
        return String(actual) !== String(value);
      case 'is_any_of':
        return value?.includes(String(actual)) ?? true;
      case 'is_none_of':
        return !(value?.includes(String(actual)) ?? false);
      case 'gt':
        return Number(actual) > Number(value);
      case 'gte':
        return Number(actual) >= Number(value);
      case 'lt':
        return Number(actual) < Number(value);
      case 'lte':
        return Number(actual) <= Number(value);
      case 'between': {
        const [from, to] = value ?? [];
        return Number(actual) >= Number(from) && Number(actual) <= Number(to);
      }
      case 'not_between': {
        const [from, to] = value ?? [];
        return !(
          Number(actual) >= Number(from) && Number(actual) <= Number(to)
        );
      }
      case 'empty':
        return actual === void 0 || actual === null || actual === '';
      case 'not_empty':
        return !(actual === void 0 || actual === null || actual === '');
      default:
        return true;
    }
  })();
  return rule.negated ? !result : result;
}
function isIncomplete(rule) {
  if (rule.operator === 'empty' || rule.operator === 'not_empty') return false;
  return (
    rule.value === void 0 ||
    (Array.isArray(rule.value) && rule.value.length === 0)
  );
}
function matches(row, node) {
  if (isFilterRule(node)) {
    if (isIncomplete(node)) return true;
    return matchesRule(row, node);
  }
  if (node.rules.length === 0) return true;
  return node.combinator === 'and'
    ? node.rules.every((child) => matches(row, child))
    : node.rules.some((child) => matches(row, child));
}
function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('');
}
function rankIn(ladder, value) {
  return ladder.findIndex((entry) => entry.value === value);
}
export function Pattern() {
  const [query, setQuery] = useState(() =>
    createFilterQuery([
      createFilterRule({
        id: 'seed-1',
        path: ['status'],
        operator: 'is_any_of',
        value: ['active', 'invited']
      })
    ])
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const rows = useMemo(
    () => STAFF.filter((row) => matches(row, query)),
    [query]
  );
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title='Staff' column={column} />
        ),
        // `min-w-0` on the text block and `truncate` on both lines, because a
        // flex child's default `min-width: auto` refuses to shrink below its
        // content: without it the longest address here pushes out of its column
        // and prints across Occupation instead of ending in an ellipsis.
        cell: ({ row }) => (
          <div className='flex items-center gap-2.5'>
            <Avatar className='size-8 shrink-0'>
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className='min-w-0'>
              <div className='text-ui-foreground truncate font-medium'>
                {row.original.name}
              </div>
              <div className='text-ui-muted-foreground truncate text-xs'>
                {row.original.email}
              </div>
            </div>
          </div>
        ),
        size: 200,
        enableSorting: true
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <DataGridColumnHeader title='Occupation' column={column} />
        ),
        // Wide enough for the longest title on ONE line. A column sized to the
        // average wraps its outliers, and a wrapped cell is a taller row for
        // every other row in the page.
        cell: (info) => (
          <span className='whitespace-nowrap'>{info.getValue()}</span>
        ),
        size: 155,
        enableSorting: true
      },
      {
        // Sorted by the ladder's own order, not by the word. An `accessorKey`
        // would sort a priority column High, Low, Medium, Urgent, which is
        // alphabetical and meaningless; the three ranked columns here all sort
        // on their rank and print their label from the row.
        id: 'priority',
        accessorFn: (row) => rankIn(PRIORITIES, row.priority),
        header: ({ column }) => (
          <DataGridColumnHeader title='Priority' column={column} />
        ),
        // `size-3.5`, the same star the menu row and the chip draw. Every other
        // glyph here is already one size in both places - the flag is `size-4`
        // in the option list and in its cell, the dot `size-2` in both - and a
        // priority that changed size on its way from the filter to the row
        // would be the only one that did.
        cell: ({ row }) => {
          const tone = PRIORITIES.find(
            (entry) => entry.value === row.original.priority
          );
          return (
            <span className='flex items-center gap-1.5'>
              <Star className={cn('size-3.5', tone?.star)} />
              {tone?.label}
            </span>
          );
        },
        size: 110,
        enableSorting: true
      },
      {
        id: 'status',
        accessorFn: (row) => rankIn(STATUSES, row.status),
        header: ({ column }) => (
          <DataGridColumnHeader title='Status' column={column} />
        ),
        // A badge here and a bare swatch in the menu, deliberately: the option
        // row prints the word beside the swatch already, so a badge there would
        // say "Invited" twice, while a cell holding nothing but the word needs
        // the box to keep it from reading as ordinary text.
        cell: ({ row }) => {
          const tone = STATUSES.find(
            (entry) => entry.value === row.original.status
          );
          return (
            <Badge variant='outline' className='gap-1.5'>
              <Dot className={tone?.dot ?? 'bg-ui-muted-foreground'} />
              {tone?.label}
            </Badge>
          );
        },
        size: 110,
        enableSorting: true
      },
      {
        id: 'availability',
        accessorFn: (row) => rankIn(AVAILABILITIES, row.availability),
        header: ({ column }) => (
          <DataGridColumnHeader title='Availability' column={column} />
        ),
        cell: ({ row }) => {
          const tone = AVAILABILITIES.find(
            (entry) => entry.value === row.original.availability
          );
          return (
            <span className='flex items-center gap-1.5'>
              <Dot className={tone?.dot ?? 'bg-ui-muted-foreground'} />
              {tone?.label}
            </span>
          );
        },
        size: 115,
        enableSorting: true
      },
      {
        accessorKey: 'location',
        header: ({ column }) => (
          <DataGridColumnHeader title='Location' column={column} />
        ),
        cell: ({ row }) => (
          <span className='flex items-center gap-1.5'>
            <Flag code={row.original.flag} />
            {row.original.location}
          </span>
        ),
        size: 140,
        enableSorting: true
      }
    ],
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    // The FILTERED rows, not the full set, so sorting, paging and the record
    // count are all taken over what the query left standing.
    data: rows,
    pageCount: Math.ceil(rows.length / pagination.pageSize),
    getRowId: (row) => row.id,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting
  });
  return (
    <DataGrid
      table={table}
      recordCount={rows.length}
      emptyMessage='No staff match these filters'
      tableLayout={{ dense: true }}
    >
      <Card className='w-full gap-0 py-0'>
        <div className='border-b p-3'>
          <Filters
            fields={fields}
            query={query}
            onQueryChange={(next) => {
              setQuery(next);
              setPagination((current) => ({ ...current, pageIndex: 0 }));
            }}
            showClear
          />
        </div>

        <DataGridContainer>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>

        <div className='border-t p-3'>
          {/*
                Four overrides, and every one of them undoes the same bug.
                `DataGridPagination` goes single row at `sm`, which is a VIEWPORT
                query rather than a container one, so inside a card narrower than
                640px it stacks its three parts however wide the card itself is:
                page buttons, then the record range, then rows-per-page, reversed by
                `order-*` and about 140px tall. In a preview frame that is most of
                the height this example has to spend, and a pager nobody can see
                cannot show that the query changed the page count.
                  flex-row py-0      the parent's own axis and padding. Plain
                                     utilities, because the primitive merges this
                                     className through `cn`, so tailwind-merge drops
                                     the `flex-col` and `py-2.5` it replaces.
                  **:order-none!     source order at every depth. Two levels need
                                     it, the two halves of the bar and the range
                                     against the buttons inside the right half.
                  *:py-0!            the two halves' own stacking padding.
                  *:last:flex-row!   the right half, which stacks internally too.
                The three `!` are load-bearing: those classes live on the
                primitive's own children, out of tailwind-merge's reach, so nothing
                else can win against them.

                `flex-wrap` is left alone deliberately, so this degrades rather than
                breaks: on a genuinely narrow phone the two halves wrap to two rows
                instead of forcing a 400px row into 375px.
              */}
          <DataGridPagination
            sizes={[5, 10, 25]}
            className='flex-row py-0 **:order-none! *:py-0! *:last:flex-row!'
          />
        </div>
      </Card>
    </DataGrid>
  );
}
