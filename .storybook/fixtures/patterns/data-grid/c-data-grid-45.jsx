'use client';
import { useMemo, useRef, useState } from 'react';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '../../../../src/components/core/DataTable/parts/data-grid-extended.jsx';
import { DataGridSelectionBar } from '../../../../src/components/core/DataTable/parts/data-grid-cell-selection-extended.jsx';
import { DataGridScrollArea } from '../../../../src/components/core/DataTable/parts/data-grid-scroll-area-extended.jsx';
import { DataGridTableRowExpand } from '../../../../src/components/core/DataTable/parts/data-grid-table-extended.jsx';
import {
  DataGridTableTreeDnd,
  DataGridTableTreeDndHandle
} from '../../../../src/components/core/DataTable/parts/data-grid-table-tree-dnd-extended.jsx';
import {
  DataGridTableTreeRowSelect,
  DataGridTableTreeRowSelectAll,
  DataGridTableTreeTotals,
  DataGridTreeExpand
} from '../../../../src/components/core/DataTable/parts/data-grid-tree-extended.jsx';
import {
  moveDataGridRow,
  useDataGridLazyRows
} from '../../../../src/components/core/DataTable/parts/data-grid-tree-rows-extended.jsx';
import { useTable } from '@tanstack/react-table-v9';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const MB = 1024 * 1024;
const file = (id, name, type, owner, modified, size) => ({ id, name, kind: 'file', type, owner, modified: new Date(modified), size });
const folder = (id, name, owner) => ({ id, name, kind: 'folder', owner, hasChildren: true });
// What the drive server holds. Folders arrive empty-handed with their totals;
// their contents load when they are opened.
const server = {
  design: [
    folder('design-brand', 'Brand', 'Maya Chen'),
    file('design-guidelines', 'Brand guidelines.pdf', 'pdf', 'Maya Chen', '2026-09-12', 18.4 * MB),
    file('design-tokens', 'Design tokens.json', 'code', 'Lina Ahmed', '2026-09-28', 0.2 * MB)
  ],
  'design-brand': [
    file('brand-logo', 'Logo pack.zip', 'archive', 'Maya Chen', '2026-08-02', 64 * MB),
    file('brand-type', 'Type specimen.pdf', 'pdf', 'Jo Morgan', '2026-07-19', 9.6 * MB)
  ],
  finance: [
    file('finance-budget', 'Budget 2027.xlsx', 'sheet', 'Sam Rivera', '2026-09-30', 1.8 * MB),
    file('finance-forecast', 'Q4 forecast.xlsx', 'sheet', 'Sam Rivera', '2026-09-21', 1.1 * MB)
  ],
  campaigns: [
    file('campaign-launch', 'Launch film.mp4', 'video', 'Jo Morgan', '2026-09-03', 412 * MB),
    file('campaign-stills', 'Launch stills.zip', 'archive', 'Jo Morgan', '2026-09-04', 96 * MB)
  ],
  archive: [
    file('archive-invoices', '2024 invoices.zip', 'archive', 'Sam Rivera', '2025-01-08', 38 * MB),
    file('archive-board', 'Board minutes 2024.pdf', 'pdf', 'Lina Ahmed', '2025-01-15', 4.2 * MB)
  ]
};
// A folder's own size and date, as the server reports them before it is opened.
function summarize(id) {
  return (server[id] ?? []).reduce(
    (total, item) => {
      const inner = item.kind === 'folder' ? summarize(item.id) : item;
      return {
        size: total.size + inner.size,
        modified: inner.modified > total.modified ? inner.modified : total.modified
      };
    },
    { size: 0, modified: new Date(0) }
  );
}
const withSummary = (item) => (item.kind === 'folder' && server[item.id] ? { ...item, ...summarize(item.id) } : item);
for (const id of Object.keys(server)) server[id] = server[id].map(withSummary);
const drive = [
  folder('design', 'Design', 'Maya Chen'),
  folder('finance', 'Finance', 'Sam Rivera'),
  {
    ...folder('marketing', 'Marketing', 'Jo Morgan'),
    // Already open on the client: its children came with the page.
    children: [
      folder('campaigns', 'Campaigns', 'Jo Morgan'),
      file('marketing-plan', 'Content plan.docx', 'doc', 'Jo Morgan', '2026-09-25', 0.6 * MB)
    ].map(withSummary)
  },
  folder('archive', 'Archive', 'Lina Ahmed'),
  file('roadmap', 'Roadmap 2027.pdf', 'pdf', 'Lina Ahmed', '2026-09-29', 3.4 * MB),
  file('handbook', 'Team handbook.docx', 'doc', 'Maya Chen', '2026-06-11', 1.2 * MB)
].map(withSummary);

const icons = { folder: 'Folder', pdf: 'FileText', doc: 'FileText', sheet: 'FileSpreadsheet', archive: 'Archive', video: 'FileImage', code: 'File' };
const bytes = (value) =>
  value == null ? '—' : value >= 1024 * MB ? `${(value / 1024 / MB).toFixed(1)} GB` : `${(value / MB).toFixed(1)} MB`;
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
// Replicated hot storage, billed at $2 per GB-month.
const monthlyCost = (size) => (size == null ? undefined : (size / 1024 / MB) * 2);
const cost = (value) => (value == null ? '—' : value > 0 && value < 0.01 ? '< $0.01' : money.format(value));
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function updateTree(rows, id, update) {
  return rows.map((row) =>
    row.id === id ? update(row) : row.children ? { ...row, children: updateTree(row.children, id, update) } : row
  );
}
function removeFromTree(rows, ids) {
  return rows
    .filter((row) => !ids.has(row.id))
    .map((row) => (row.children ? { ...row, children: removeFromTree(row.children, ids) } : row));
}
function findInTree(rows, id) {
  for (const row of rows) {
    if (row.id === id) return row;
    const inner = row.children && findInTree(row.children, id);
    if (inner) return inner;
  }
  return undefined;
}

export function Pattern() {
  const [data, setData] = useState(drive);
  const [expanded, setExpanded] = useState({ marketing: true });
  const [rowSelection, setRowSelection] = useState({});
  // This drive's copy of the server, so moves stay with this example.
  const remote = useRef(null);
  remote.current ??= { ...server };
  // The archive is slow today: its first request times out.
  const archiveAttempts = useRef(0);
  const lazy = useDataGridLazyRows({
    data,
    expanded,
    getRowHasChildren: (row) => row.kind === 'folder' && row.hasChildren,
    loadChildren: async (row) => {
      await wait(450);
      if (row.id === 'archive' && archiveAttempts.current++ === 0) throw new Error('The request timed out');
      return remote.current[row.id] ?? [];
    },
    // Loaded children join the drive's own data, so rows can move between folders.
    onChildrenLoad: (id, children) => setData((rows) => updateTree(rows, id, (row) => ({ ...row, children })))
  });
  const columns = useMemo(
    () => [
      {
        id: 'move',
        header: () => <span className='sr-only'>Move</span>,
        cell: () => <DataGridTableTreeDndHandle />,
        size: 40,
        enableSorting: false
      },
      {
        id: 'select',
        header: () => <DataGridTableTreeRowSelectAll />,
        cell: ({ row }) => <DataGridTableTreeRowSelect row={row} />,
        size: 40,
        enableSorting: false
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const item = row.original;
          const open = item.kind === 'folder' && row.getIsExpanded();
          return (
            <div className='flex min-w-0 items-center gap-1.5'>
              <DataGridTableRowExpand row={row} className='-ms-1.5' />
              <RegistryIcon
                lucide={item.kind === 'folder' ? (open ? 'FolderOpen' : 'Folder') : icons[item.type]}
                className={item.kind === 'folder' ? 'text-ui-primary size-4 shrink-0' : 'text-ui-muted-foreground size-4 shrink-0'}
                aria-hidden='true'
              />
              <span className='truncate font-medium'>{item.name}</span>
            </div>
          );
        },
        size: 300,
        meta: { treeColumn: true }
      },
      {
        accessorKey: 'owner',
        id: 'owner',
        header: 'Owner',
        cell: ({ getValue }) => <span className='text-ui-muted-foreground'>{getValue()}</span>,
        size: 150
      },
      {
        accessorKey: 'modified',
        id: 'modified',
        header: 'Last modified',
        cell: ({ getValue }) => <span className='tabular-nums'>{getValue() ? dateFormat.format(getValue()) : '—'}</span>,
        // A folder shows the newest change anywhere inside it.
        aggregationFn: 'max',
        size: 140,
        meta: {
          rollup: true,
          rollupCell: ({ value }) => <span className='tabular-nums'>{value ? dateFormat.format(value) : '—'}</span>
        }
      },
      {
        accessorKey: 'size',
        id: 'size',
        header: () => <span className='block text-end'>Size</span>,
        cell: ({ getValue }) => <span className='tabular-nums'>{bytes(getValue())}</span>,
        aggregationFn: 'sum',
        size: 110,
        meta: {
          cellClassName: 'text-end',
          rollup: true,
          rollupCell: ({ value }) => <span className='tabular-nums'>{bytes(value)}</span>
        }
      },
      {
        id: 'cost',
        accessorFn: (row) => monthlyCost(row.size),
        header: () => <span className='block text-end'>Cost / month</span>,
        cell: ({ getValue }) => <span className='tabular-nums'>{cost(getValue())}</span>,
        aggregationFn: 'sum',
        size: 130,
        meta: {
          cellClassName: 'text-end',
          rollup: true,
          rollupCell: ({ value }) => <span className='tabular-nums'>{cost(value ?? 0)}</span>
        }
      }
    ],
    []
  );
  const table = useTable({
    features: dataGridFeatures,
    columns,
    ...lazy.tableOptions,
    // The drive is the page: every row renders, nested ones included.
    manualPagination: true,
    state: { expanded, rowSelection },
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    autoResetExpanded: false
  });
  const handleRowMove = (move) => {
    const target = move.parentId ? findInTree(data, move.parentId) : null;
    if (target && target.children === undefined) {
      // Into a folder that has not loaded: the server takes the file, and the
      // folder's own total grows until it is opened.
      const item = findInTree(data, move.id);
      remote.current[target.id] = [...(remote.current[target.id] ?? []), item];
      setData((rows) =>
        updateTree(removeFromTree(rows, new Set([move.id])), target.id, (row) => ({
          ...row,
          hasChildren: true,
          size: (row.size ?? 0) + (item.size ?? 0)
        }))
      );
      return;
    }
    setData((rows) => moveDataGridRow(rows, move, { childrenKey: 'children' }));
    if (move.position === 'inside') setExpanded((old) => (old === true ? old : { ...old, [move.parentId]: true }));
  };
  const removeSelected = () => {
    const ids = new Set(table.getSelectedRowModel().flatRows.map((row) => row.id));
    setData((rows) => removeFromTree(rows, ids));
    setRowSelection({});
  };
  return (
    <DataGrid
      table={table}
      recordCount={data.length}
      lazyRows={lazy}
      onRowMove={handleRowMove}
      tableLayout={{ headerBackground: true, footerBackground: true }}
    >
      <Card className='w-full gap-0 p-0'>
        <CardHeader className='flex flex-wrap items-center justify-between gap-3 px-4 py-3'>
          <div className='min-w-0'>
            <CardTitle className='text-sm font-medium'>Shared drive</CardTitle>
            <CardDescription className='text-xs'>
              Drag files into folders, or focus a grip and press Enter to move with the keyboard.
            </CardDescription>
          </div>
          <CardAction className='flex flex-wrap items-center gap-2'>
            <DataGridTreeExpand levels={3} />
          </CardAction>
        </CardHeader>
        <CardContent className='border-t px-0'>
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTableTreeDnd footerContent={<DataGridTableTreeTotals label='All files' />} />
            </DataGridScrollArea>
          </DataGridContainer>
        </CardContent>
      </Card>
      <DataGridSelectionBar label={(count) => `${count} ${count === 1 ? 'item' : 'items'} selected`}>
        <Button variant='outline' size='sm'>
          <RegistryIcon lucide='Download' aria-hidden='true' />
          Download
        </Button>
        <Button variant='destructive' size='sm' onClick={removeSelected}>
          <RegistryIcon lucide='Trash2' aria-hidden='true' />
          Delete
        </Button>
      </DataGridSelectionBar>
    </DataGrid>
  );
}
