'use client';
import { useMemo, useState } from 'react';
import {
  DataGrid,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridPagination } from '../../../../src/components/core/DataTable/parts/data-grid-pagination-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import {
  DataGridTable,
  DataGridTableFootRow,
  DataGridTableFootRowCell
} from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import { Filters } from '../../../../src/components/core/FilterBar/parts/filters-extended.jsx';
import {
  createFilterGroup,
  createFilterQuery,
  createFilterRule,
  isFilterRule
} from '../../../../src/components/core/FilterBar/parts/filters-query-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
function Dot({ className }) {
  return <span className={cn('size-2 shrink-0 rounded-full', className)} />;
}
function Person({ avatar, name }) {
  return (
    <Avatar aria-hidden='true' className='size-4.5 shrink-0'>
      <AvatarImage src={avatar} alt='' />
      <AvatarFallback className='text-xs'>
        {name
          .split(' ')
          .map((part) => part[0])
          .join('')}
      </AvatarFallback>
    </Avatar>
  );
}
const STAGES = [
  { value: 'discovery', label: 'Discovery', tone: 'bg-zinc-400' },
  { value: 'evaluation', label: 'Evaluation', tone: 'bg-sky-500' },
  { value: 'negotiation', label: 'Negotiation', tone: 'bg-amber-500' },
  { value: 'closed-won', label: 'Closed won', tone: 'bg-emerald-500' },
  { value: 'closed-lost', label: 'Closed lost', tone: 'bg-ui-destructive' }
];
const OWNERS = [
  {
    value: 'ada',
    label: 'Ada Lovelace',
    avatar:
      'static/images/art/7.svg'
  },
  {
    value: 'grace',
    label: 'Grace Hopper',
    avatar:
      'static/images/art/1.svg'
  },
  {
    value: 'alan',
    label: 'Alan Turing',
    avatar:
      'static/images/art/4.svg'
  },
  {
    value: 'barbara',
    label: 'Barbara Liskov',
    avatar:
      'static/images/art/3.svg'
  }
];
const REGIONS = [
  { value: 'emea', label: 'EMEA' },
  { value: 'amer', label: 'AMER' },
  { value: 'apac', label: 'APAC' }
];
function StackedTones({ options, empty }) {
  const tone = (value) =>
    STAGES.find((entry) => entry.value === value)?.tone ??
    'bg-ui-muted-foreground';
  if (options.length === 0) return <>{empty}</>;
  if (options.length === 1) {
    return (
      <span className='flex min-w-0 items-center gap-1.5'>
        <Dot className={tone(options[0].value)} />
        <span className='truncate'>{options[0].label}</span>
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
              tone(option.value)
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
function StackedOwners({ options }) {
  if (options.length === 0) return <>anyone</>;
  return (
    <span className='flex min-w-0 items-center gap-1.5'>
      <AvatarGroup>
        {options.slice(0, 3).map((option) => (
          <Person
            key={option.value}
            avatar={OWNERS_BY_VALUE.get(option.value)?.avatar ?? ''}
            name={option.label}
          />
        ))}
      </AvatarGroup>
      {options.length === 1 ? (
        <span className='truncate'>{options[0].label}</span>
      ) : (
        <span className='text-ui-muted-foreground text-xs tabular-nums'>
          {options.length}
        </span>
      )}
    </span>
  );
}
const OWNER_LABELS = new Map(OWNERS.map((entry) => [entry.value, entry.label]));
const OWNERS_BY_VALUE = new Map(OWNERS.map((entry) => [entry.value, entry]));
const REGION_LABELS = new Map(
  REGIONS.map((entry) => [entry.value, entry.label])
);
const DEALS = [
  {
    id: 'd-1',
    stage: 'discovery',
    owner: 'grace',
    amount: 72e3,
    account: { name: 'Coho Vineyard', region: 'emea', seats: 640 }
  },
  {
    id: 'd-2',
    stage: 'discovery',
    owner: 'ada',
    amount: 64e3,
    account: { name: 'Adatum', region: 'emea', seats: 780 }
  },
  {
    id: 'd-3',
    stage: 'evaluation',
    owner: 'barbara',
    amount: 58e3,
    account: { name: 'Relecloud', region: 'apac', seats: 880 }
  },
  {
    id: 'd-4',
    stage: 'negotiation',
    owner: 'barbara',
    amount: 52e3,
    account: { name: 'Tailspin Toys', region: 'amer', seats: 310 }
  },
  {
    id: 'd-5',
    stage: 'negotiation',
    owner: 'grace',
    amount: 48e3,
    account: { name: 'Contoso Group', region: 'emea', seats: 140 }
  },
  {
    id: 'd-6',
    stage: 'negotiation',
    owner: 'ada',
    amount: 44e3,
    account: { name: 'Trey Research', region: 'emea', seats: 350 }
  },
  {
    id: 'd-7',
    stage: 'closed-lost',
    owner: 'barbara',
    amount: 37e3,
    account: { name: 'Blue Yonder', region: 'emea', seats: 410 }
  },
  {
    id: 'd-8',
    stage: 'closed-won',
    owner: 'alan',
    amount: 31e3,
    account: { name: 'Proseware', region: 'apac', seats: 220 }
  },
  {
    id: 'd-9',
    stage: 'evaluation',
    owner: 'barbara',
    amount: 26500,
    account: { name: 'Wingtip Toys', region: 'emea', seats: 60 }
  },
  {
    id: 'd-10',
    stage: 'negotiation',
    owner: 'grace',
    amount: 25e3,
    account: { name: 'Litware', region: 'emea', seats: 500 }
  },
  {
    id: 'd-11',
    stage: 'negotiation',
    owner: 'alan',
    amount: 21e3,
    account: { name: 'Fourth Coffee', region: 'emea', seats: 940 }
  },
  {
    id: 'd-12',
    stage: 'evaluation',
    owner: 'ada',
    amount: 18e3,
    account: { name: 'Northwind', region: 'emea', seats: 620 }
  },
  {
    id: 'd-13',
    stage: 'evaluation',
    owner: 'grace',
    amount: 15500,
    account: { name: 'Woodgrove', region: 'emea', seats: 1200 }
  },
  {
    id: 'd-14',
    stage: 'evaluation',
    owner: 'alan',
    amount: 9e3,
    account: { name: 'Fabrikam', region: 'emea', seats: 90 }
  }
];
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});
const count = new Intl.NumberFormat('en-US');
const COMPACT_OPERATORS = {
  gt: 'over',
  gte: 'at least',
  lt: 'under',
  lte: 'at most'
};
const fields = [
  {
    id: 'stage',
    label: 'Stage',
    type: 'select',
    defaultOperator: 'is_any_of',
    // The same swatches the rows below carry, so the picker and the report
    // speak one colour language rather than two.
    options: STAGES.map((entry) => ({
      value: entry.value,
      label: entry.label,
      icon: <Dot className={entry.tone} />
    })),
    renderValue: ({ options }) => (
      <StackedTones options={options} empty='any stage' />
    ),
    icon: <RegistryIcon lucide='SignpostIcon' />
  },
  {
    // A deal has ONE owner, so this is a select whose value happens to be a
    // list, not a multiselect: `is any of` asks a question about the row's
    // single owner, where `has any of` would ask about a set the row does not
    // have.
    id: 'owner',
    label: 'Owner',
    type: 'select',
    defaultOperator: 'is_any_of',
    // The option panel, widened by the field that needs it. The built-in menu
    // defaults to `w-48`, which holds a status or a tag; these rows carry a
    // 20px face and a full name, and at the default width a two-part name
    // truncates. `className` lands last in the panel's own `cn`, so this wins.
    className: 'w-56',
    // The same faces the rows below carry, for the reason Stage carries the
    // same swatches: the picker and the report speak one language, so an owner
    // picked from a list of faces is recognised in the table by the face rather
    // than re-read by name.
    options: OWNERS.map((entry) => ({
      value: entry.value,
      label: entry.label,
      icon: <Person avatar={entry.avatar} name={entry.label} />
    })),
    pinSelected: true,
    sortSelected: 'label',
    renderValue: ({ options }) => <StackedOwners options={options} />,
    icon: <RegistryIcon lucide='UserIcon' />
  },
  {
    id: 'amount',
    label: 'Amount',
    type: 'number',
    defaultOperator: 'gte',
    // The cell printed `25000` six pixels from a column printing `$25,000`:
    // one quantity in two notations, in a panel whose whole claim is that the
    // tree reached the data.
    //
    // A formatted token is also what turns this cell from a text box into a
    // popover, and that is the primitive's rule rather than a choice here -
    // `usesInlineTextEditor` excludes any field with a custom display, because
    // an input showing `25000` underneath a cell reading "$25,000" contradicts
    // the row it sits in. Seats below keeps no renderer for exactly that
    // reason: the panel needs one cell you can still type straight into.
    renderValue: (context) => (
      <span className='flex min-w-0 items-center gap-1.5'>
        <span className='truncate tabular-nums'>{formatMoney(context)}</span>
        <TermReach hits={reach(['amount'], context)} />
      </span>
    ),
    // The display changed the notation, so the accessible name has to follow
    // it. The built-in name is `String(value)`, which announces "25000" to
    // precisely the audience the formatted cell is hiding it from.
    valueText: formatMoney,
    icon: <RegistryIcon lucide='BanknoteIcon' />
  },
  {
    id: 'account',
    label: 'Account',
    icon: <RegistryIcon lucide='Building2Icon' />,
    // Nested, so a row's attribute cell opens the same drill-down picker the
    // chip flow uses. One picker, two chromes.
    fields: [
      {
        id: 'name',
        label: 'Name',
        type: 'text',
        renderValue: (context) => (
          <PatternValue
            value={context.value}
            operator={context.operator.value}
            hits={reach(['account', 'name'], context)}
          />
        )
      },
      {
        id: 'region',
        label: 'Region',
        type: 'select',
        options: REGIONS,
        // Three options, so the search box is more chrome than the rows under
        // it. The input is still there and still owns the keyboard, it is only
        // visually hidden, and typing narrows the list exactly as typing into a
        // native select does.
        searchable: false,
        renderValue: (context) => (
          <RegionValue
            options={context.options}
            hits={reach(['account', 'region'], context)}
          />
        )
      },
      // THE ONE CELL LEFT BARE, and deliberately. Seats has the same notation
      // gap Amount had - a rule at 1200 prints `1200` under a column printing
      // `1,200` - and closing it would cost the panel its last inline text box,
      // because a custom display is what makes a value cell a popover. A
      // builder where nothing can be typed straight into loses a real
      // interaction, so this field is the control the other three are measured
      // against.
      { id: 'seats', label: 'Seats', type: 'number' }
    ]
  }
];
const SEED = createFilterQuery(
  [
    createFilterRule({
      id: 'seed-1',
      path: ['stage'],
      operator: 'is_any_of',
      value: ['evaluation', 'negotiation']
    }),
    createFilterGroup({
      id: 'seed-group',
      combinator: 'or',
      rules: [
        createFilterRule({
          id: 'seed-2',
          path: ['amount'],
          operator: 'gte',
          value: 25e3
        }),
        createFilterRule({
          id: 'seed-3',
          path: ['account', 'seats'],
          operator: 'gte',
          value: 500
        })
      ]
    }),
    createFilterRule({
      id: 'seed-4',
      path: ['account', 'region'],
      operator: 'is',
      value: 'emea'
    })
  ],
  'and'
);
const list = (value) => (Array.isArray(value) ? value.map(String) : []);
const text = (value) => String(value ?? '').toLowerCase();
const TESTS = {
  is: (actual, value) => String(actual) === String(value),
  is_not: (actual, value) => String(actual) !== String(value),
  is_any_of: (actual, value) => list(value).includes(String(actual)),
  is_none_of: (actual, value) => !list(value).includes(String(actual)),
  contains: (actual, value) => text(actual).includes(text(value)),
  not_contains: (actual, value) => !text(actual).includes(text(value)),
  starts_with: (actual, value) => text(actual).startsWith(text(value)),
  ends_with: (actual, value) => text(actual).endsWith(text(value)),
  eq: (actual, value) => Number(actual) === Number(value),
  neq: (actual, value) => Number(actual) !== Number(value),
  gt: (actual, value) => Number(actual) > Number(value),
  gte: (actual, value) => Number(actual) >= Number(value),
  lt: (actual, value) => Number(actual) < Number(value),
  lte: (actual, value) => Number(actual) <= Number(value),
  between: (actual, value) => {
    const [from, to] = list(value);
    return Number(actual) >= Number(from) && Number(actual) <= Number(to);
  },
  not_between: (actual, value) => {
    const [from, to] = list(value);
    return !(Number(actual) >= Number(from) && Number(actual) <= Number(to));
  },
  empty: (actual) => actual === void 0 || actual === null || actual === '',
  not_empty: (actual) =>
    !(actual === void 0 || actual === null || actual === '')
};
function read(deal, path) {
  return path.reduce(
    (value, key) =>
      typeof value === 'object' && value !== null ? value[key] : void 0,
    deal
  );
}
function isIncomplete(operator, value) {
  if (operator === 'empty' || operator === 'not_empty') return false;
  if (value === void 0) return true;
  if (!Array.isArray(value)) return false;
  return (
    value.length === 0 ||
    value.some((entry) => entry === void 0 || entry === null || entry === '')
  );
}
function matches(deal, node) {
  if (!isFilterRule(node)) {
    if (node.rules.length === 0) return true;
    return node.combinator === 'and'
      ? node.rules.every((child) => matches(deal, child))
      : node.rules.some((child) => matches(deal, child));
  }
  const test = TESTS[node.operator];
  if (!test || isIncomplete(node.operator, node.value)) return true;
  const result = test(read(deal, node.path), node.value);
  return node.negated ? !result : result;
}
function reach(path, { operator, value }) {
  const test = TESTS[operator.value];
  if (!test || isIncomplete(operator.value, value)) return null;
  return DEALS.filter((deal) => test(read(deal, path), value)).length;
}
function TermReach({ hits }) {
  if (hits === null) return null;
  return (
    <span
      className={cn(
        'shrink-0 text-xs tabular-nums @max-[7rem]/cell:hidden',
        hits === 0 ? 'text-ui-destructive' : 'text-ui-muted-foreground'
      )}
    >
      {hits}/{DEALS.length}
    </span>
  );
}
function formatMoney({ value, labels }) {
  const bound = (entry) => {
    if (entry === null || entry === '') return '';
    const amount = Number(entry);
    return Number.isFinite(amount) ? money.format(amount) : '';
  };
  const [from, to] = Array.isArray(value)
    ? [bound(value[0]), bound(value[1])]
    : [bound(value), ''];
  if (from && to) return labels.valueRange(from, to);
  return from || to || 'any amount';
}
function RegionValue({ options, hits }) {
  if (options.length === 0) return <>any region</>;
  const shown = options.slice(0, 2);
  const overflow = options.length - shown.length;
  return (
    <span className='flex min-w-0 items-center gap-1.5'>
      <span className='truncate'>
        {shown.map((option) => option.label).join(', ')}
      </span>
      {overflow > 0 ? (
        <span className='text-ui-muted-foreground shrink-0 text-xs tabular-nums'>
          +{overflow}
        </span>
      ) : null}
      <TermReach hits={hits} />
    </span>
  );
}
function PatternEllipsis() {
  return <span className='text-ui-muted-foreground shrink-0'>...</span>;
}
function PatternValue({ value, operator, hits }) {
  const term = typeof value === 'string' ? value.trim() : '';
  if (!term) return <>any name</>;
  const loose = operator === 'contains' || operator === 'not_contains';
  const lead = loose || operator === 'ends_with';
  const trail = loose || operator === 'starts_with';
  return (
    <span className='flex min-w-0 items-center gap-1.5'>
      <span className='flex min-w-0 items-center'>
        {lead ? <PatternEllipsis /> : null}
        <span className='truncate'>{term}</span>
        {trail ? <PatternEllipsis /> : null}
      </span>
      <TermReach hits={hits} />
    </span>
  );
}
const GUTTER_START = 'ps-4';
const GUTTER_END = 'pe-4';
function rankIn(ladder, value) {
  return ladder.findIndex((entry) => entry.value === value);
}
export function Pattern() {
  const [query, setQuery] = useState(SEED);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });
  const [sorting, setSorting] = useState([{ id: 'amount', desc: true }]);
  const rows = useMemo(
    () => DEALS.filter((deal) => matches(deal, query)),
    [query]
  );
  const totals = useMemo(
    () =>
      rows.reduce(
        (sum, deal) => ({
          seats: sum.seats + deal.account.seats,
          amount: sum.amount + deal.amount
        }),
        { seats: 0, amount: 0 }
      ),
    [rows]
  );
  const applyQuery = (next) => {
    setQuery(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };
  const columns = useMemo(
    () => [
      {
        // Sorted on the account name, which is the line the cell leads with.
        id: 'account',
        accessorFn: (row) => row.account.name,
        header: ({ column }) => (
          <DataGridColumnHeader title='Account' column={column} />
        ),
        // The region rides under the name rather than taking a sixth column.
        // It has to be printed somewhere - the seeded query's last term filters
        // on it - and at this width a column of four-letter codes would have
        // cost more than the two rows of every other cell do.
        //
        // `min-w-0` on the text block and `truncate` on both lines, because a
        // flex child's default `min-width: auto` refuses to shrink below its
        // content: without it the longest account here prints across Stage
        // instead of ending in an ellipsis.
        cell: ({ row }) => (
          <div className='min-w-0'>
            <div className='text-ui-foreground truncate font-medium'>
              {row.original.account.name}
            </div>
            <div className='text-ui-muted-foreground truncate text-xs'>
              {REGION_LABELS.get(row.original.account.region)}
            </div>
          </div>
        ),
        size: 125,
        enableSorting: true,
        meta: {
          headerClassName: GUTTER_START,
          cellClassName: GUTTER_START
        }
      },
      {
        // Sorted by the ladder's own order, not by the word. An `accessorKey`
        // would sort a stage column Closed lost, Closed won, Discovery,
        // Evaluation, Negotiation, which is alphabetical and says nothing about
        // a pipeline.
        id: 'stage',
        accessorFn: (row) => rankIn(STAGES, row.stage),
        header: ({ column }) => (
          <DataGridColumnHeader title='Stage' column={column} />
        ),
        // A badge here and a bare swatch in the picker, deliberately: the option
        // row prints the word beside the swatch already, so a badge there would
        // say "Negotiation" twice, while a cell holding nothing but the word
        // needs the style's own label treatment to keep it from reading as
        // ordinary text.
        //
        // WHAT that treatment is belongs to the style and not to this cell.
        // Seven of the eight draw a bordered pill; sera drops the border, the
        // fill and the radius on every badge it has and answers with small
        // uppercase letter-spaced type instead. Both stop the cell from reading
        // like the Owner cell beside it, which is the whole job, and a `border`
        // utility forced on here would make this the one boxed badge in a sera
        // app.
        cell: ({ row }) => {
          const stage = STAGES.find(
            (entry) => entry.value === row.original.stage
          );
          return (
            <Badge variant='outline' className='gap-1.5'>
              <Dot className={stage?.tone ?? 'bg-ui-muted-foreground'} />
              {stage?.label}
            </Badge>
          );
        },
        size: 110,
        enableSorting: true
      },
      {
        // The LABEL, not the slug, so the sort agrees with what the cell prints.
        // Sorting on `owner` would order by "ada", "alan", "barbara", "grace",
        // which happens to match here and would stop matching the day an owner
        // whose slug and name disagree is added.
        id: 'owner',
        accessorFn: (row) => OWNER_LABELS.get(row.owner) ?? row.owner,
        header: ({ column }) => (
          <DataGridColumnHeader title='Owner' column={column} />
        ),
        // The roster example's staff cell, one line shorter. There a person is
        // a face over a name over an email; a deal's owner has no second line
        // to carry, so the face sits beside the name instead of above it and
        // the cell keeps the row at the dense height.
        //
        // `truncate` and not the `whitespace-nowrap` this replaces, which is
        // the change the avatar forces rather than a preference. Nowrap text
        // does not shrink and does not clip: it prints straight over Seats the
        // moment the column is narrower than the name, and the avatar took 28px
        // out of the width this column has to spend. `min-w-0` with it, because
        // a flex child refuses to shrink below its content without it, and
        // `shrink-0` lives on the avatar so the ellipsis is always the name's.
        cell: ({ row }) => {
          const owner = OWNERS_BY_VALUE.get(row.original.owner);
          return (
            <div className='flex items-center gap-1.5'>
              {owner ? (
                <Person avatar={owner.avatar} name={owner.label} />
              ) : null}
              <span className='min-w-0 truncate'>
                {owner?.label ?? row.original.owner}
              </span>
            </div>
          );
        },
        size: 134,
        enableSorting: true
      },
      // The two numeric columns are RIGHT aligned, and the foot row follows
      // them. `tabular-nums` alone equalises digit WIDTHS; it does not line up
      // place values, so aligned left the 60 of one row and the 1,200 of
      // another put their units digit two characters apart, and the total ends
      // up the widest thing in a column it is supposed to sit under. Aligned
      // right, ones fall under ones and each total lands under the last digit
      // of what it sums - which is the whole claim this example makes.
      //
      // `headerClassName` and `cellClassName` are the grid's own per-column
      // hooks and land on the `th` and the `td`, which is all the cells need.
      // It is NOT all a SORTABLE header needs: that branch draws its title
      // inside a flex row, and a flex child does not move for `text-align`.
      // Hence `ms-auto` on the header button, and `-me-2` with it so the ghost
      // button's own `px-2` hangs outside the cell - the mirror of the `-ms-2`
      // the primitive already applies on the left, and without it the header
      // word sits eight pixels inboard of every digit under it.
      {
        id: 'seats',
        accessorFn: (row) => row.account.seats,
        header: ({ column }) => (
          <DataGridColumnHeader
            title='Seats'
            column={column}
            className='ms-auto -me-2'
          />
        ),
        cell: ({ row }) => (
          <span className='tabular-nums'>
            {count.format(row.original.account.seats)}
          </span>
        ),
        size: 79,
        enableSorting: true,
        meta: {
          headerClassName: 'text-right rtl:text-left',
          cellClassName: 'text-right rtl:text-left'
        }
      },
      {
        accessorKey: 'amount',
        id: 'amount',
        header: ({ column }) => (
          <DataGridColumnHeader
            title='Amount'
            column={column}
            className='ms-auto -me-2'
          />
        ),
        cell: ({ row }) => (
          <span className='font-medium tabular-nums'>
            {money.format(row.original.amount)}
          </span>
        ),
        size: 104,
        enableSorting: true,
        meta: {
          headerClassName: `text-right rtl:text-left ${GUTTER_END}`,
          cellClassName: `text-right rtl:text-left ${GUTTER_END}`
        }
      }
    ],
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    // The FILTERED rows, not the full set, so sorting, paging, the record count
    // and the foot row are all taken over what the query left standing.
    data: rows,
    pageCount: Math.ceil(rows.length / pagination.pageSize),
    getRowId: (row) => row.id,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting
  });
  const footer = (
    <DataGridTableFootRow>
      <DataGridTableFootRowCell colSpan={3} className={GUTTER_START}>
        <span className='text-ui-muted-foreground'>Filtered total</span>
      </DataGridTableFootRowCell>
      <DataGridTableFootRowCell className='text-right font-medium tabular-nums rtl:text-left'>
        {count.format(totals.seats)}
      </DataGridTableFootRowCell>
      <DataGridTableFootRowCell
        className={`text-right font-medium tabular-nums rtl:text-left ${GUTTER_END}`}
      >
        {money.format(totals.amount)}
      </DataGridTableFootRowCell>
    </DataGridTableFootRow>
  );
  return (
    <DataGrid
      table={table}
      recordCount={rows.length}
      emptyMessage='No deals match these filters'
      tableLayout={{ dense: true }}
    >
      {/*
      Card spacing is a per-style token, and this report has to hold its
      height in a fixed frame, so the card zeroes its own padding and each
      part pays for its own. That is the same composition the data-grid
      examples use for a card that is a page rather than a tile.
    */}
      <Card className='w-full gap-0 p-0'>
        <CardHeader className='flex items-center justify-between gap-3 px-4 py-2'>
          {/*
      Title over count rather than beside it. Side by side they need about
      180px, and a style with taller, wider controls (sera's are
      uppercase) leaves the left of this header barely 110px, at which
      point the only shrinkable item, the title, truncates to nothing and
      the card loses its name. Stacked, the group asks for the width of
      its widest line - and the count is the one thing on screen that says
      the query is doing something while the panel is shut.
    */}
          <div className='flex min-w-0 flex-col gap-0.5'>
            <CardTitle className='truncate text-sm font-medium'>
              Pipeline
            </CardTitle>
            <CardDescription className='truncate text-xs tabular-nums'>
              {rows.length} of {DEALS.length} deals
            </CardDescription>
          </div>

          {/*
                POPOVER, not inline, and the grid is why. Inline reads more like a
                real report page, and the sibling example that walks a tree back out
                renders it that way inside its own `Card`; here the whole seeded
                query is five rows of builder, about 260px, and spending that above
                a table would leave the table to be scrolled rather than read. Hung
                off a trigger it costs one 32px control, opens over the rows it is
                about, and the count badge the primitive draws on it says how many
                conditions are in force without opening anything.

                `className` on `Filters` would land on the POPOVER panel, not on the
                trigger, so the toolbar's own layout belongs to this action group.
              */}
          <CardAction className='flex shrink-0 items-center gap-2'>
            <Filters
              variant='advanced'
              advancedMode='popover'
              advancedAlign='end'
              reorderable
              fields={fields}
              operatorLabels={COMPACT_OPERATORS}
              pathCollapse='start'
              maxPathSegments={1}
              className='[--filter-field-width:9rem] [--filter-operator-width:6.5rem] [--filter-value-width:10.5rem]'
              query={query}
              onQueryChange={applyQuery}
            />

            {/*
                  Restoring the view is the only button beside the trigger. Emptying
                  the query is the panel's own footer action, and a toolbar copy of a
                  control that already exists one click away is two places to keep in
                  agreement for nothing.

                  Identity, not deep equality, decides whether there is anything to
                  restore: every edit publishes a new query object, so the seeded one
                  is still the seeded one exactly while nothing has been changed.
                */}
            <Button
              variant='ghost'
              disabled={query === SEED}
              onClick={() => applyQuery(SEED)}
            >
              Reset
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className='border-y px-0'>
          <DataGridScrollArea>
            <DataGridTable footerContent={footer} />
          </DataGridScrollArea>
        </CardContent>

        {/*
              `border-t-0`, because two styles draw this line already. Six of the
              eight leave the card footer unbordered and take one from the content
              block above it, which is what `border-y` up there is for; nova and
              lyra give the footer an unconditional `border-t` of its own, and the
              two land on the same pixel row as a visible double rule. Suppressing
              the footer's own copy rather than dropping `border-y` is what keeps
              the other six bordered - and it has to be this way round, because a
              `border-t` utility added here would also match the
              `[.border-t]:pt-(--card-spacing)` rule those six ship and replace this
              bar's 10px of padding with the style's full card spacing.

              The utility wins on layer order, not specificity: the per-style card
              rules are imported into `layer(base)` and tailwind's utilities come
              after it, so the style's footer selector loses to a plain `border-t-0`
              despite being the more specific one.
            */}
        <CardFooter className='border-t-0 px-4 py-2.5'>
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
            className='flex-row py-0 *:py-0! **:order-none! *:last:flex-row!'
          />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
