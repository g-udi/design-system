'use client';
import { useMemo, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  DataGrid,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridExport } from '../../../../src/components/core/DataTable/parts/data-grid-export-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import {
  DataGridTable,
  DataGridTableFootRow,
  DataGridTableFootRowCell
} from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import { constructAggregationFn, useTable } from '@tanstack/react-table-v9';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';

const portrait = (path) => `https://randomuser.me/api/portraits/${path}.jpg`;
const authors = {
  maya: { name: 'Maya Chen', avatar: portrait('women/44') },
  sam: { name: 'Sam Rivera', avatar: portrait('men/11') },
  jo: { name: 'Jo Morgan', avatar: portrait('women/68') },
  lina: { name: 'Lina Ahmed', avatar: portrait('women/12') }
};
// An editorial quarter: enough articles per category and status for the groups to mean something.
const articles = [
  ['kg', 'A practical guide to knowledge graphs', 'Engineering', 'Published', 'maya', 2480, 18420, 12.4],
  ['lf', 'Notes on local-first software', 'Engineering', 'Draft', 'sam', 940, 0, 0],
  ['ev', 'Evaluating retrieval pipelines', 'Engineering', 'In review', 'sam', 2050, 3120, 21.3],
  ['ci', 'Fast builds without a monorepo', 'Engineering', 'Published', 'jo', 1720, 9840, 6.2],
  ['rd', 'Designing interfaces that survive real data', 'Design', 'In review', 'lina', 1860, 9210, 4.1],
  ['tp', 'Design tokens in production', 'Design', 'Published', 'lina', 1540, 11380, -2.4],
  ['ai', 'Accessible interfaces by default', 'Design', 'Published', 'maya', 2210, 15630, 8.7],
  ['mo', 'Motion that explains instead of decorates', 'Design', 'Draft', 'jo', 1180, 0, 0],
  ['rm', 'Research methods for small teams', 'Research', 'Published', 'jo', 3120, 12050, -3.2],
  ['sw', 'Why the semantic web still matters', 'Research', 'Published', 'maya', 2890, 7340, -1.5],
  ['iv', 'Interviews that change the roadmap', 'Research', 'In review', 'lina', 1960, 2210, 15.8]
].map(([id, title, category, status, author, words, reads, change]) => ({
  id,
  title,
  category,
  status,
  author: authors[author].name,
  avatar: authors[author].avatar,
  words,
  reads,
  change
}));
const statusVariant = {
  Published: 'success-outline',
  'In review': 'warning-outline',
  Draft: 'info-outline'
};
const number = new Intl.NumberFormat('en-GB');
// A custom aggregate: reads earned per thousand words, computed from the group's own totals.
const readsPerThousandWords = constructAggregationFn({
  aggregate: ({ rows }) => {
    const words = rows.reduce((total, row) => total + row.original.words, 0);
    const reads = rows.reduce((total, row) => total + row.original.reads, 0);
    return words ? Math.round((reads / words) * 1000) : 0;
  }
});
const groupings = [
  ['none', 'No grouping'],
  ['category', 'Category'],
  ['status', 'Status'],
  ['author', 'Author']
];

export function Pattern() {
  const [grouping, setGrouping] = useState(['category']);
  const [expanded, setExpanded] = useState(true);
  const [sorting, setSorting] = useState([{ id: 'reads', desc: true }]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        id: 'title',
        header: ({ column }) => <DataGridColumnHeader title='Article' column={column} />,
        cell: ({ row }) => <span className='block truncate font-medium'>{row.original.title}</span>,
        enableGrouping: false,
        aggregationFn: 'count',
        aggregatedCell: ({ getValue }) => (
          <span className='text-ui-muted-foreground'>{getValue()} articles</span>
        ),
        size: 260,
        meta: { headerTitle: 'Article' }
      },
      {
        accessorKey: 'category',
        id: 'category',
        header: ({ column }) => <DataGridColumnHeader title='Category' column={column} />,
        cell: ({ getValue }) => <span className='text-ui-muted-foreground'>{getValue()}</span>,
        size: 170,
        meta: { headerTitle: 'Category' }
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title='Status' column={column} />,
        cell: ({ getValue }) => <Badge variant={statusVariant[getValue()]}>{getValue()}</Badge>,
        size: 170,
        meta: { headerTitle: 'Status' }
      },
      {
        accessorKey: 'author',
        id: 'author',
        header: ({ column }) => <DataGridColumnHeader title='Author' column={column} />,
        cell: ({ row }) => (
          <span className='flex items-center gap-2'>
            <Avatar className='size-6'>
              <AvatarImage src={row.original.avatar} alt='' />
              <AvatarFallback>{row.original.author[0]}</AvatarFallback>
            </Avatar>
            {row.original.author}
          </span>
        ),
        aggregationFn: 'uniqueCount',
        aggregatedCell: ({ getValue }) => (
          <span className='text-ui-muted-foreground'>{getValue()} authors</span>
        ),
        size: 170,
        meta: { headerTitle: 'Author' }
      },
      {
        accessorKey: 'words',
        id: 'words',
        header: ({ column }) => <DataGridColumnHeader title='Words' column={column} />,
        cell: ({ getValue }) => <span className='tabular-nums'>{number.format(getValue())}</span>,
        aggregationFn: 'sum',
        enableGrouping: false,
        size: 110,
        meta: { headerTitle: 'Words', cellClassName: 'text-end', headerClassName: 'text-end' }
      },
      {
        accessorKey: 'reads',
        id: 'reads',
        header: ({ column }) => <DataGridColumnHeader title='Reads' column={column} />,
        cell: ({ getValue }) => <span className='tabular-nums'>{getValue() ? number.format(getValue()) : '—'}</span>,
        aggregationFn: 'sum',
        enableGrouping: false,
        size: 110,
        meta: { headerTitle: 'Reads', cellClassName: 'text-end' }
      },
      {
        id: 'engagement',
        accessorFn: (row) => (row.words ? Math.round((row.reads / row.words) * 1000) : 0),
        header: ({ column }) => <DataGridColumnHeader title='Reads per 1k words' column={column} />,
        cell: ({ getValue }) => <span className='tabular-nums'>{number.format(getValue())}</span>,
        aggregationFn: readsPerThousandWords,
        enableGrouping: false,
        size: 160,
        meta: { headerTitle: 'Reads per 1k words', cellClassName: 'text-end' }
      },
      {
        accessorKey: 'change',
        id: 'change',
        header: ({ column }) => <DataGridColumnHeader title='30 days' column={column} />,
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return <span className='text-ui-muted-foreground'>—</span>;
          return <span className={value > 0 ? 'text-success' : 'text-danger'}>{value > 0 ? '+' : '−'}{Math.abs(value).toFixed(1)}%</span>;
        },
        aggregationFn: 'mean',
        aggregatedCell: ({ getValue }) => (
          <span className='text-ui-muted-foreground tabular-nums'>avg {getValue().toFixed(1)}%</span>
        ),
        enableGrouping: false,
        size: 110,
        meta: { headerTitle: '30 days', cellClassName: 'text-end', exportValue: (value) => value.toFixed(1) }
      }
    ],
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: articles,
    getRowId: (row) => row.id,
    state: { grouping, expanded, sorting },
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    // Expansion follows the toggle above rather than resetting when the grouping changes.
    autoResetExpanded: false
  });
  // Grand totals come from the same aggregation registry as the group rows.
  const total = (id) => table.getColumn(id).getAggregationValue();
  const footer = (
    <DataGridTableFootRow>
      <DataGridTableFootRowCell colSpan={4}>
        <span className='font-medium'>All articles</span>{' '}
        <span className='text-ui-muted-foreground'>· {articles.length}</span>
      </DataGridTableFootRowCell>
      <DataGridTableFootRowCell className='text-end tabular-nums'>{number.format(total('words'))}</DataGridTableFootRowCell>
      <DataGridTableFootRowCell className='text-end tabular-nums'>{number.format(total('reads'))}</DataGridTableFootRowCell>
      <DataGridTableFootRowCell className='text-end tabular-nums'>{number.format(total('engagement'))}</DataGridTableFootRowCell>
      <DataGridTableFootRowCell className='text-end tabular-nums'>avg {total('change').toFixed(1)}%</DataGridTableFootRowCell>
    </DataGridTableFootRow>
  );
  const groupedBy = grouping[0] || 'none';
  return (
    <DataGrid
      table={table}
      recordCount={articles.length}
      tableLayout={{ columnsGroupable: true, headerBackground: true }}
    >
      <Card className='w-full gap-0 p-0'>
        <CardHeader className='flex flex-wrap items-center justify-between gap-3 px-4 py-3'>
          <CardTitle className='text-sm font-medium'>Articles this quarter</CardTitle>
          <CardAction className='flex flex-wrap items-center gap-2'>
            <ToggleGroup
              type='single'
              size='sm'
              variant='outline'
              aria-label='Group articles by'
              className='flex-wrap'
              value={groupedBy}
              onValueChange={(value) => {
                if (!value) return;
                // A new grouping opens all of its groups.
                setGrouping(value === 'none' ? [] : [value]);
                setExpanded(true);
              }}
            >
              {groupings.map(([value, label]) => (
                <ToggleGroupItem key={value} value={value}>
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <DataGridExport filename='articles-this-quarter.csv' />
          </CardAction>
        </CardHeader>
        <CardContent className='border-t px-0'>
          <DataGridScrollArea>
            <DataGridTable footerContent={footer} />
          </DataGridScrollArea>
        </CardContent>
      </Card>
    </DataGrid>
  );
}
