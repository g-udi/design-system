'use client';
import { useId, useMemo, useRef, useState } from 'react';
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures
} from '@gaudi/design-system/core/DataTable';
import {
  DataGridCellSelection,
  DataGridSelectionBar
} from '@gaudi/design-system/core/DataTable';
import {
  DataGridCellToggle,
  DataGridHistoryControls,
  DataGridSaveBar,
  useDataGridEditing
} from '@gaudi/design-system/core/DataTable';
import { DataGridScrollArea } from '@gaudi/design-system/core/DataTable';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll
} from '@gaudi/design-system/core/DataTable';
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
const CATEGORIES = [
  { value: 'audio', label: 'Audio' },
  { value: 'displays', label: 'Displays' },
  { value: 'peripherals', label: 'Peripherals' },
  { value: 'storage', label: 'Storage' },
  { value: 'networking', label: 'Networking' }
];
const SUPPLIERS = [
  'Adatum Networks',
  'Contoso Displays',
  'Fabrikam Peripherals',
  'Litware Supply',
  'Northwind Audio',
  'Proseware Components',
  'Tailspin Storage',
  'Wingtip Electronics'
];
const inventory = [
  { id: 'inv-1', sku: 'AU-1042', name: 'Studio headphones', category: 'audio', supplier: 'Northwind Audio', stock: 42, price: 189, restock: '2026-10-14', taxable: true, active: true },
  { id: 'inv-2', sku: 'AU-1077', name: 'Desktop speakers', category: 'audio', supplier: 'Northwind Audio', stock: 18, price: 129.5, restock: '2026-10-21', taxable: true, active: true },
  { id: 'inv-3', sku: 'DS-2011', name: '27in 4K monitor', category: 'displays', supplier: 'Contoso Displays', stock: 7, price: 449.99, restock: '2026-11-02', taxable: true, active: true },
  { id: 'inv-4', sku: 'DS-2048', name: 'Portable display', category: 'displays', supplier: 'Contoso Displays', stock: 25, price: 219, restock: '', taxable: true, active: false },
  { id: 'inv-5', sku: 'PE-3003', name: 'Mechanical keyboard', category: 'peripherals', supplier: 'Fabrikam Peripherals', stock: 64, price: 139, restock: '2026-10-09', taxable: true, active: true },
  { id: 'inv-6', sku: 'PE-3017', name: 'Wireless mouse', category: 'peripherals', supplier: 'Fabrikam Peripherals', stock: 120, price: 59, restock: '2026-10-28', taxable: false, active: true },
  { id: 'inv-7', sku: 'ST-4410', name: '2TB portable SSD', category: 'storage', supplier: 'Tailspin Storage', stock: 31, price: 169, restock: '2026-11-11', taxable: true, active: true },
  { id: 'inv-8', sku: 'NW-5120', name: 'Wi-Fi 7 router', category: 'networking', supplier: 'Adatum Networks', stock: 12, price: 299, restock: '', taxable: true, active: true }
];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export function Pattern() {
  const toasterId = useId();
  const gridApiRef = useRef(null);
  const nextIdRef = useRef(inventory.length + 1);
  // The saved records; useDataGridEditing keeps the working copy on top.
  const [saved, setSaved] = useState(inventory);
  const [rowSelection, setRowSelection] = useState({});
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableResizing: false,
        enableCellSelection: false,
        size: 40
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
        size: 100,
        meta: {
          cellClassName: 'font-mono text-xs',
          cellEdit: {
            control: 'text',
            required: 'Every item needs a SKU',
            validate: (value) =>
              /^[A-Z]{2}-\d{4}$/.test(String(value)) || 'Use two letters, a dash and four digits'
          }
        }
      },
      {
        accessorKey: 'name',
        header: 'Item',
        size: 190,
        meta: {
          cellClassName: 'font-medium',
          cellEdit: { control: 'text', required: 'Name the item' }
        }
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 130,
        cell: ({ getValue }) => (
          <Badge variant='outline'>
            {CATEGORIES.find((option) => option.value === getValue())?.label}
          </Badge>
        ),
        meta: { cellEdit: { control: 'select', options: CATEGORIES } }
      },
      {
        accessorKey: 'supplier',
        header: 'Supplier',
        size: 190,
        meta: {
          cellEdit: { control: 'combobox', options: SUPPLIERS, required: 'Pick a supplier' }
        }
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        size: 80,
        meta: {
          cellClassName: 'text-end tabular-nums',
          headerClassName: 'justify-end',
          cellEdit: {
            control: 'number',
            min: 0,
            clearValue: 0,
            validate: (value) => Number.isInteger(value) || 'Stock is a whole number'
          }
        }
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 90,
        cell: ({ getValue }) =>
          typeof getValue() === 'number' ? `$${getValue().toFixed(2)}` : '',
        meta: {
          cellClassName: 'text-end tabular-nums',
          headerClassName: 'justify-end',
          cellEdit: {
            control: 'number',
            step: 0.5,
            format: (value) => (typeof value === 'number' ? value.toFixed(2) : ''),
            validate: (value) => value > 0 || 'Set a price above zero'
          }
        }
      },
      {
        accessorKey: 'restock',
        header: 'Restock',
        size: 130,
        cell: ({ getValue }) =>
          getValue() ? (
            format(parseISO(getValue()), 'MMM d, yyyy')
          ) : (
            <span className='text-ui-muted-foreground'>Not scheduled</span>
          ),
        meta: { cellEdit: { control: 'date' } }
      },
      {
        accessorKey: 'taxable',
        header: 'Taxable',
        size: 80,
        cell: ({ cell }) => <DataGridCellToggle cell={cell} />,
        meta: { cellEdit: { control: 'checkbox' } }
      },
      {
        accessorKey: 'active',
        header: 'Active',
        size: 80,
        cell: ({ cell }) => <DataGridCellToggle cell={cell} />,
        meta: { cellEdit: { control: 'switch' } }
      }
    ],
    []
  );
  const editing = useDataGridEditing({
    data: saved,
    columns,
    onSave: async ({ rows, updated, added, removed }) => {
      await wait(500);
      setSaved(rows);
      const count = updated.length + added.length + removed.length;
      toast.success(`Saved ${count} ${count === 1 ? 'change' : 'changes'}`, { toasterId, id: `${toasterId}-inventory-save` });
    },
    onReject: (rejected) => {
      const readonly = rejected.filter((entry) => entry.reason === 'readonly').length;
      if (readonly) toast.info(`${readonly} read-only ${readonly === 1 ? 'cell was' : 'cells were'} skipped`, { toasterId, id: `${toasterId}-inventory-readonly` });
    }
  });
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: editing.rows,
    getRowId: (row) => row.id,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true
  });
  const newId = () => `inv-${nextIdRef.current++}`;
  const addItem = () => {
    const id = newId();
    editing.insertRow({ id, sku: '', name: '', category: 'audio', supplier: '', stock: 0, price: 0, restock: '', taxable: true, active: true });
    gridApiRef.current?.focusCell(id, 'sku', { edit: true });
  };
  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
  return (
    <DataGrid
      table={table}
      recordCount={editing.rows.length}
      {...editing.gridProps}
      onRowCreate={addItem}
      rowCreateLabel='Add item'
      tableLayout={{
        dense: true,
        cellSelection: true,
        cellFillHandle: true,
        cellBorder: true,
        headerBackground: true
      }}
    >
      <ToastProvider id={toasterId} />
      <Card className='w-full gap-3 py-3.5'>
        <CardHeader className='flex flex-wrap items-start justify-between gap-3 px-3.5'>
          <div className='grid min-w-0 grow basis-60 gap-1'>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>Type, paste or drag the fill handle to edit; changes stay pending until you save.</CardDescription>
          </div>
          <CardAction className='flex flex-wrap items-center gap-2'>
            <DataGridHistoryControls history={editing.history} />
            <Button size='sm' variant='outline' onClick={addItem}>
              <RegistryIcon lucide='PlusIcon' />
              Add item
            </Button>
          </CardAction>
        </CardHeader>
        <DataGridContainer className='border-y'>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
          <DataGridCellSelection apiRef={gridApiRef} />
        </DataGridContainer>
        {/* Both bars float together at the bottom of the grid. */}
        <div className='sticky bottom-4 z-40 flex flex-wrap items-center justify-center gap-2 px-3.5'>
          <DataGridSelectionBar className='static mx-0' label={(count) => `${count} selected`}>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                for (const id of selectedIds) {
                  editing.duplicateRow(id, (row) => ({ ...row, id: newId(), sku: '', name: `${row.name} copy` }));
                }
                setRowSelection({});
              }}
            >
              <RegistryIcon lucide='Copy' />
              Duplicate
            </Button>
            <Button
              size='sm'
              variant='outline'
              tone='danger'
              onClick={() => {
                editing.removeRows(selectedIds);
                setRowSelection({});
              }}
            >
              <RegistryIcon lucide='Trash2' />
              Delete
            </Button>
          </DataGridSelectionBar>
          <DataGridSaveBar editing={editing} apiRef={gridApiRef} className='static mx-0' />
        </div>
      </Card>
    </DataGrid>
  );
}
