// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useMemo, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridColumnHeader } from '../../../../src/components/core/DataTable/parts/data-grid-column-header-extended.jsx';
import { DataGridPagination } from '../../../../src/components/core/DataTable/parts/data-grid-pagination-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll
} from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
const orders = [
  {
    id: '1',
    reference: 'ORD-4417',
    customer: 'Alex Johnson',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'AJ',
    city: 'Berlin',
    status: 'shipped',
    total: 249.9
  },
  {
    id: '2',
    reference: 'ORD-4418',
    customer: 'Sarah Chen',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'SC',
    city: 'Osaka',
    status: 'processing',
    total: 89
  },
  {
    id: '3',
    reference: 'ORD-4421',
    customer: 'Michael Rodriguez',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    initials: 'MR',
    city: 'Madrid',
    status: 'shipped',
    total: 1290.5
  },
  {
    id: '4',
    reference: 'ORD-4425',
    customer: 'Emma Wilson',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    initials: 'EW',
    city: 'Hamburg',
    status: 'processing',
    total: 45.25
  },
  {
    id: '5',
    reference: 'ORD-4430',
    customer: 'David Kim',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    initials: 'DK',
    city: 'Seoul',
    status: 'shipped',
    total: 615
  },
  {
    id: '6',
    reference: 'ORD-4433',
    customer: 'Maria Garcia',
    avatar:
      'https://randomuser.me/api/portraits/women/90.jpg',
    initials: 'MG',
    city: 'Lisbon',
    status: 'processing',
    total: 132.75
  },
  {
    id: '7',
    reference: 'ORD-4440',
    customer: 'James Brown',
    avatar:
      'https://randomuser.me/api/portraits/men/54.jpg',
    initials: 'JB',
    city: 'Toronto',
    status: 'shipped',
    total: 78.4
  }
];
const localeContent = {
  en: {
    label: 'EN',
    columns: {
      reference: 'Order',
      customer: 'Customer',
      city: 'City',
      status: 'Status',
      total: 'Total'
    },
    status: { shipped: 'Shipped', processing: 'Processing' },
    currency: 'USD',
    i18n: {}
  },
  de: {
    label: 'DE',
    columns: {
      reference: 'Bestellung',
      customer: 'Kunde',
      city: 'Stadt',
      status: 'Status',
      total: 'Summe'
    },
    status: { shipped: 'Versandt', processing: 'In Bearbeitung' },
    currency: 'EUR',
    i18n: {
      labels: {
        sortAscending: 'Aufsteigend',
        sortDescending: 'Absteigend',
        pinColumnStart: 'Links anheften',
        pinColumnEnd: 'Rechts anheften',
        moveColumnStart: 'Nach links verschieben',
        moveColumnEnd: 'Nach rechts verschieben',
        columnsMenu: 'Spalten',
        toggleColumns: 'Spalten ein- und ausblenden',
        selectAll: 'Alle ausw\xE4hlen',
        selectRow: 'Zeile ausw\xE4hlen',
        rowsPerPage: 'Zeilen pro Seite',
        paginationInfo: ({ from, to, count }) => `${from}-${to} von ${count}`,
        previousPage: 'Vorherige Seite',
        nextPage: 'N\xE4chste Seite',
        goToPage: (page) => `Seite ${page}`,
        empty: 'Keine Daten vorhanden'
      }
    }
  },
  ja: {
    label: '\u65E5\u672C\u8A9E',
    columns: {
      reference: '\u6CE8\u6587',
      customer: '\u9867\u5BA2',
      city: '\u90FD\u5E02',
      status: '\u72B6\u614B',
      total: '\u5408\u8A08'
    },
    status: {
      shipped: '\u767A\u9001\u6E08\u307F',
      processing: '\u51E6\u7406\u4E2D'
    },
    currency: 'JPY',
    i18n: {
      labels: {
        sortAscending: '\u6607\u9806',
        sortDescending: '\u964D\u9806',
        pinColumnStart: '\u5DE6\u306B\u56FA\u5B9A',
        pinColumnEnd: '\u53F3\u306B\u56FA\u5B9A',
        moveColumnStart: '\u5DE6\u3078\u79FB\u52D5',
        moveColumnEnd: '\u53F3\u3078\u79FB\u52D5',
        columnsMenu: '\u5217',
        toggleColumns: '\u5217\u306E\u8868\u793A\u5207\u308A\u66FF\u3048',
        selectAll: '\u3059\u3079\u3066\u9078\u629E',
        selectRow: '\u884C\u3092\u9078\u629E',
        rowsPerPage: '1\u30DA\u30FC\u30B8\u306E\u884C\u6570',
        /* Japanese counts the total first, the reason these labels are
           functions rather than templates with fixed placeholders. */
        paginationInfo: ({ from, to, count }) =>
          `${count}\u4EF6\u4E2D ${from}-${to}\u4EF6`,
        previousPage: '\u524D\u306E\u30DA\u30FC\u30B8',
        nextPage: '\u6B21\u306E\u30DA\u30FC\u30B8',
        goToPage: (page) => `${page}\u30DA\u30FC\u30B8\u76EE`,
        empty: '\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093'
      }
    }
  }
};
const localeTags = {
  en: 'en-US',
  de: 'de-DE',
  ja: 'ja-JP'
};
export function Pattern() {
  const [locale, setLocale] = useState('en');
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });
  const content = localeContent[locale];
  const columns = useMemo(() => {
    const money = new Intl.NumberFormat(localeTags[locale], {
      style: 'currency',
      currency: content.currency,
      maximumFractionDigits: content.currency === 'JPY' ? 0 : 2
    });
    return [
      {
        id: 'select',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        size: 44,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false
      },
      {
        accessorKey: 'reference',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={content.columns.reference}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className='font-mono text-xs'>{row.original.reference}</span>
        ),
        size: 110
      },
      {
        accessorKey: 'customer',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={content.columns.customer}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Avatar className='size-6'>
              <AvatarImage
                src={row.original.avatar}
                alt={row.original.customer}
              />
              <AvatarFallback className='text-[10px]'>
                {row.original.initials}
              </AvatarFallback>
            </Avatar>
            <span className='text-ui-foreground truncate font-medium'>
              {row.original.customer}
            </span>
          </div>
        ),
        size: 200
      },
      {
        accessorKey: 'city',
        header: ({ column }) => (
          <DataGridColumnHeader title={content.columns.city} column={column} />
        ),
        cell: ({ row }) => (
          <span className='truncate'>{row.original.city}</span>
        ),
        size: 120
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={content.columns.status}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'shipped'
                ? 'success-light'
                : 'warning-light'
            }
          >
            {content.status[row.original.status]}
          </Badge>
        ),
        size: 140
      },
      {
        accessorKey: 'total',
        header: ({ column }) => (
          <DataGridColumnHeader title={content.columns.total} column={column} />
        ),
        cell: ({ row }) => (
          <span className='block text-end tabular-nums'>
            {money.format(row.original.total)}
          </span>
        ),
        size: 130,
        meta: { headerClassName: 'text-end [&>div]:justify-end' }
      }
    ];
  }, [content, locale]);
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: orders,
    getRowId: (row) => row.id,
    state: { sorting, pagination, rowSelection },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true
  });
  return (
    <DataGrid
      table={table}
      recordCount={orders.length}
      i18n={content.i18n}
      tableLayout={{ columnsPinnable: true, columnsMovable: true }}
    >
      <Card className='w-full gap-3 py-3.5'>
        <CardHeader className='items-center px-3.5'>
          <CardTitle>Orders</CardTitle>
          <CardAction>
            <ToggleGroup
              variant='outline'
              size='sm'
              type='single'
              value={locale}
              onValueChange={(next) => next && setLocale(next)}
              aria-label='Grid language'
            >
              {Object.keys(localeContent).map((value) => (
                <ToggleGroupItem key={value} value={value}>
                  {localeContent[value].label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardAction>
        </CardHeader>
        <DataGridContainer className='border-y'>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
        <CardFooter className='border-none bg-transparent! px-3.5 py-0'>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
