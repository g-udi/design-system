'use client';
import { getColumnHeaderLabel, useDataGrid } from './data-grid-extended.jsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../DropdownMenu/parts/dropdown-menu.jsx';
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
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
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
