'use client';
import { useDataGrid } from '../DataGrid.jsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../DropdownMenu/DropdownMenuPrimitives.jsx';
import { getColumnHeaderLabel } from '../dataGridModel.js';
function DataGridColumnVisibility({ table, trigger }) {
  const { i18n } = useDataGrid();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-[150px]'>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='font-medium'>
            {i18n.labels.toggleColumns}
          </DropdownMenuLabel>
          {table
            .getAllLeafColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {getColumnHeaderLabel(column)}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export { DataGridColumnVisibility };
