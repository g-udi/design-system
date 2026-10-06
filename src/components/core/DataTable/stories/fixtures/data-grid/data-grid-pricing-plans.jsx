'use client';
import { useId, useMemo, useRef, useState } from 'react';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '@gaudi/design-system/core/DataTable';
import {
  DataGridRowEditActions,
  useDataGridRowEditing
} from '@gaudi/design-system/core/DataTable';
import { DataGridScrollArea } from '@gaudi/design-system/core/DataTable';
import { DataGridTable } from '@gaudi/design-system/core/DataTable';
import { useTable } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import ToastProvider, { toast } from '@gaudi/design-system/core/Toast';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const INTERVALS = [
  { value: 'month', label: 'Monthly' },
  { value: 'year', label: 'Yearly' }
];
const REGIONS = ['Global', 'North America', 'Europe', 'Asia Pacific', 'Latin America'];
const plans = [
  { id: 'starter', name: 'Starter', price: 9, interval: 'month', seats: 1, region: 'Global', launch: '2026-01-15', trial: true, public: true },
  { id: 'team', name: 'Team', price: 29, interval: 'month', seats: 10, region: 'Global', launch: '2026-01-15', trial: true, public: true },
  { id: 'business', name: 'Business', price: 790, interval: 'year', seats: 50, region: 'North America', launch: '2026-03-01', trial: false, public: true },
  { id: 'enterprise', name: 'Enterprise', price: 2400, interval: 'year', seats: 250, region: 'Europe', launch: '2026-06-01', trial: false, public: false }
];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export function Pattern() {
  const toasterId = useId();
  const [data, setData] = useState(plans);
  const nextIdRef = useRef(1);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Plan',
        size: 160,
        meta: {
          cellClassName: 'font-medium',
          cellEdit: { control: 'text', required: 'Name the plan', placeholder: 'Plan name' }
        }
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 110,
        cell: ({ row }) => `$${row.original.price.toLocaleString()}`,
        meta: {
          cellClassName: 'tabular-nums',
          cellEdit: {
            control: 'number',
            min: 0,
            validate: (value, row) =>
              row.interval === 'year' && value > 0 && value < 50
                ? 'Yearly plans start at $50'
                : null
          }
        }
      },
      {
        accessorKey: 'interval',
        header: 'Billing',
        size: 130,
        cell: ({ getValue }) => INTERVALS.find((option) => option.value === getValue())?.label,
        meta: { cellEdit: { control: 'select', options: INTERVALS } }
      },
      {
        accessorKey: 'seats',
        header: 'Seats',
        size: 90,
        meta: {
          cellClassName: 'tabular-nums',
          cellEdit: {
            control: 'number',
            min: 1,
            validate: (value) => Number.isInteger(value) || 'Seats are whole numbers'
          }
        }
      },
      {
        accessorKey: 'region',
        header: 'Region',
        size: 170,
        meta: { cellEdit: { control: 'combobox', options: REGIONS, required: 'Pick a region' } }
      },
      {
        accessorKey: 'launch',
        header: 'Launch',
        size: 150,
        cell: ({ getValue }) => (getValue() ? format(parseISO(getValue()), 'MMM d, yyyy') : '—'),
        meta: { cellEdit: { control: 'date', required: 'Pick a launch date' } }
      },
      {
        accessorKey: 'trial',
        header: 'Trial',
        size: 80,
        cell: ({ getValue }) => (getValue() ? '14 days' : <span className='text-ui-muted-foreground'>None</span>),
        meta: { cellEdit: { control: 'switch' } }
      },
      {
        accessorKey: 'public',
        header: 'Listed',
        size: 90,
        cell: ({ getValue }) =>
          getValue() ? <Badge variant='success-light'>Listed</Badge> : <Badge variant='outline'>Hidden</Badge>,
        meta: { cellEdit: { control: 'checkbox' } }
      },
      {
        id: 'actions',
        header: () => <span className='sr-only'>Actions</span>,
        size: 150,
        enableSorting: false,
        cell: ({ row }) => <DataGridRowEditActions row={row} label={row.original.name || 'new plan'} />
      }
    ],
    []
  );
  const rowEditing = useDataGridRowEditing({
    columns,
    onSave: async (draft, { isNew }) => {
      await wait(300);
      setData((previous) => previous.map((plan) => (plan.id === draft.id ? draft : plan)));
      toast.success(isNew ? `${draft.name} created` : `${draft.name} saved`, { toasterId, id: `${toasterId}-plan-save` });
    },
    // A plan added but never saved goes away again.
    onCancel: ({ rowId, isNew }) => {
      if (isNew) setData((previous) => previous.filter((plan) => plan.id !== rowId));
    }
  });
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data,
    getRowId: (row) => row.id,
    // The actions stay in reach while the plan scrolls sideways on small screens.
    state: {
      columnPinning: { start: [], end: ['actions'] },
      columnSizing: { actions: rowEditing.rowId ? 150 : 56 }
    }
  });
  const addPlan = () => {
    if (rowEditing.rowId) return;
    const plan = { id: `plan-${nextIdRef.current++}`, name: '', price: 0, interval: 'month', seats: 1, region: 'Global', launch: '', trial: false, public: false };
    setData((previous) => [...previous, plan]);
    rowEditing.start(plan, { isNew: true });
  };
  return (
    <DataGrid table={table} recordCount={data.length} {...rowEditing.gridProps} tableLayout={{ headerBackground: true, columnsPinnable: true }}>
      <ToastProvider id={toasterId} />
      <Card className='w-full gap-3 py-3.5'>
        <CardHeader className='flex flex-wrap items-start justify-between gap-3 px-3.5'>
          <div className='grid min-w-0 grow basis-60 gap-1'>
            <CardTitle>Pricing plans</CardTitle>
            <CardDescription>Edit one plan at a time. Enter saves the row and Escape cancels it.</CardDescription>
          </div>
          <CardAction>
            <Button size='sm' variant='outline' disabled={!!rowEditing.rowId} onClick={addPlan}>
              <RegistryIcon lucide='PlusIcon' />
              Add plan
            </Button>
          </CardAction>
        </CardHeader>
        <DataGridContainer className='border-t'>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
      </Card>
    </DataGrid>
  );
}
