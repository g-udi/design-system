'use client';
import { memo, useMemo } from 'react';
import { getColumnHeaderLabel, useDataGrid } from './data-grid-extended.jsx';
import { Subscribe } from '@tanstack/react-table-v9';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../../DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function DataGridColumnHeaderInner({
  column,
  title,
  icon,
  className,
  filter,
  visibility = false
}) {
  const { i18n, isLoading, table, props } = useDataGrid();
  const resolvedTitle = title ?? getColumnHeaderLabel(column);
  const columnOrderState = table.state.columnOrder;
  const columnOrder =
    columnOrderState.length > 0
      ? columnOrderState
      : table.getAllLeafColumns().map((leafColumn) => leafColumn.id);
  const columnVisibilityKey =
    props.tableLayout?.columnsVisibility && visibility
      ? JSON.stringify(table.state.columnVisibility)
      : '';
  const isSorted = column.getIsSorted();
  const isPinned = column.getIsPinned();
  const canSort = column.getCanSort();
  const canPin = column.getCanPin();
  const canResize = column.getCanResize();
  const columnIndex = columnOrder.indexOf(column.id);
  const canMoveLeft = columnIndex > 0;
  const canMoveRight = columnIndex < columnOrder.length - 1;
  const handleSort = () => {
    if (isSorted === 'asc') {
      column.toggleSorting(true);
    } else if (isSorted === 'desc') {
      column.clearSorting();
    } else {
      column.toggleSorting(false);
    }
  };
  const headerLabelClassName = cn(
    'text-ui-secondary-foreground inline-flex h-full items-center gap-1.5 font-normal [&_svg]:opacity-60 text-sm [&_svg]:size-3.5',
    className
  );
  const headerButtonClassName = cn(
    'text-ui-secondary-foreground hover:bg-ui-secondary data-[state=open]:bg-ui-secondary hover:text-ui-foreground data-[state=open]:text-ui-foreground px-2 font-normal h-6 rounded-lg',
    className
  );
  const sortIcon =
    canSort &&
    (isSorted === 'desc' ? (
      <RegistryIcon
        lucide='ArrowDownIcon'
        className='size-3.25'
        aria-hidden='true'
      />
    ) : isSorted === 'asc' ? (
      <RegistryIcon
        lucide='ArrowUpIcon'
        className='size-3.25'
        aria-hidden='true'
      />
    ) : (
      <RegistryIcon
        lucide='ChevronsUpDownIcon'
        className='mt-px size-3.25'
        aria-hidden='true'
      />
    ));
  const hasControls =
    props.tableLayout?.columnsMovable ||
    (props.tableLayout?.columnsVisibility && visibility) ||
    (props.tableLayout?.columnsPinnable && canPin) ||
    filter;
  const menuItems = useMemo(() => {
    const items = [];
    let hasPreviousSection = false;
    if (filter) {
      items.push(
        <DropdownMenuGroup key='group-filter'>
          <DropdownMenuLabel key='filter'>{filter}</DropdownMenuLabel>
        </DropdownMenuGroup>
      );
      hasPreviousSection = true;
    }
    if (canSort) {
      if (hasPreviousSection) {
        items.push(<DropdownMenuSeparator key='sep-sort' />);
      }
      items.push(
        <DropdownMenuItem
          key='sort-asc'
          onClick={() => {
            if (isSorted === 'asc') {
              column.clearSorting();
            } else {
              column.toggleSorting(false);
            }
          }}
          disabled={!canSort}
        >
          <RegistryIcon lucide='ArrowUpIcon' className='size-3.5!' />
          <span className='grow'>{i18n.labels.sortAscending}</span>
          {isSorted === 'asc' && (
            <RegistryIcon
              lucide='CheckIcon'
              className='text-ui-primary size-4 opacity-100!'
            />
          )}
        </DropdownMenuItem>,
        <DropdownMenuItem
          key='sort-desc'
          onClick={() => {
            if (isSorted === 'desc') {
              column.clearSorting();
            } else {
              column.toggleSorting(true);
            }
          }}
          disabled={!canSort}
        >
          <RegistryIcon lucide='ArrowDownIcon' className='size-3.5!' />
          <span className='grow'>{i18n.labels.sortDescending}</span>
          {isSorted === 'desc' && (
            <RegistryIcon
              lucide='CheckIcon'
              className='text-ui-primary size-4 opacity-100!'
            />
          )}
        </DropdownMenuItem>
      );
      hasPreviousSection = true;
    }
    if (props.tableLayout?.columnsPinnable && canPin) {
      if (hasPreviousSection) {
        items.push(<DropdownMenuSeparator key='sep-pin' />);
      }
      items.push(
        <DropdownMenuItem
          key='pin-left'
          onClick={() => column.pin(isPinned === 'start' ? false : 'start')}
        >
          <RegistryIcon
            lucide='ArrowLeftToLineIcon'
            className='size-3.5!'
            aria-hidden='true'
          />
          <span className='grow'>{i18n.labels.pinColumnStart}</span>
          {isPinned === 'start' && (
            <RegistryIcon
              lucide='CheckIcon'
              className='text-ui-primary size-4 opacity-100!'
            />
          )}
        </DropdownMenuItem>,
        <DropdownMenuItem
          key='pin-right'
          onClick={() => column.pin(isPinned === 'end' ? false : 'end')}
        >
          <RegistryIcon
            lucide='ArrowRightToLineIcon'
            className='size-3.5!'
            aria-hidden='true'
          />
          <span className='grow'>{i18n.labels.pinColumnEnd}</span>
          {isPinned === 'end' && (
            <RegistryIcon
              lucide='CheckIcon'
              className='text-ui-primary size-4 opacity-100!'
            />
          )}
        </DropdownMenuItem>
      );
      hasPreviousSection = true;
    }
    if (props.tableLayout?.columnsMovable) {
      if (hasPreviousSection) {
        items.push(<DropdownMenuSeparator key='sep-move' />);
      }
      items.push(
        <DropdownMenuItem
          key='move-left'
          onClick={() => {
            if (columnIndex > 0) {
              const newOrder = [...columnOrder];
              const [movedColumn] = newOrder.splice(columnIndex, 1);
              newOrder.splice(columnIndex - 1, 0, movedColumn);
              table.setColumnOrder(newOrder);
            }
          }}
          disabled={!canMoveLeft || isPinned !== false}
        >
          <RegistryIcon
            lucide='ArrowLeftIcon'
            className='size-3.5!'
            aria-hidden='true'
          />
          <span>{i18n.labels.moveColumnStart}</span>
        </DropdownMenuItem>,
        <DropdownMenuItem
          key='move-right'
          onClick={() => {
            if (columnIndex < columnOrder.length - 1) {
              const newOrder = [...columnOrder];
              const [movedColumn] = newOrder.splice(columnIndex, 1);
              newOrder.splice(columnIndex + 1, 0, movedColumn);
              table.setColumnOrder(newOrder);
            }
          }}
          disabled={!canMoveRight || isPinned !== false}
        >
          <RegistryIcon
            lucide='ArrowRightIcon'
            className='size-3.5!'
            aria-hidden='true'
          />
          <span>{i18n.labels.moveColumnEnd}</span>
        </DropdownMenuItem>
      );
      hasPreviousSection = true;
    }
    if (props.tableLayout?.columnsVisibility && visibility) {
      if (hasPreviousSection) {
        items.push(<DropdownMenuSeparator key='sep-visibility' />);
      }
      items.push(
        <DropdownMenuSub key='visibility'>
          <DropdownMenuSubTrigger>
            <RegistryIcon lucide='Settings2Icon' className='size-3.5!' />
            <span>{i18n.labels.columnsMenu}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  className='capitalize'
                >
                  {getColumnHeaderLabel(col)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }
    return items;
    // Visibility is a mutable table-store snapshot; its key invalidates menu checks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filter,
    canSort,
    isSorted,
    column,
    props.tableLayout?.columnsPinnable,
    props.tableLayout?.columnsMovable,
    props.tableLayout?.columnsVisibility,
    canPin,
    isPinned,
    canMoveLeft,
    canMoveRight,
    visibility,
    table,
    columnIndex,
    columnOrder,
    i18n.labels,
    columnVisibilityKey
    // Needed to update checkbox states when visibility changes
  ]);
  if (hasControls) {
    return (
      <div className='-ms-2 flex h-full items-center justify-between gap-1.5'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className={headerButtonClassName}
              disabled={isLoading}
            >
              {icon && icon}
              {resolvedTitle}
              {sortIcon}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-40' align='start'>
            {menuItems}
          </DropdownMenuContent>
        </DropdownMenu>
        {props.tableLayout?.columnsPinnable && canPin && isPinned && (
          <Button
            size='icon-sm'
            variant='ghost'
            className='rounded-lg -me-1 size-7'
            onClick={() => column.pin(false)}
            aria-label={i18n.labels.unpinColumn(resolvedTitle)}
            title={i18n.labels.unpinColumn(resolvedTitle)}
          >
            <RegistryIcon
              lucide='PinOffIcon'
              className='size-3.5! opacity-50!'
              aria-hidden='true'
            />
          </Button>
        )}
      </div>
    );
  }
  if (canSort || (props.tableLayout?.columnsResizable && canResize)) {
    return (
      <div className='-ms-2 flex h-full items-center'>
        <Button
          variant='ghost'
          className={headerButtonClassName}
          disabled={isLoading}
          onClick={handleSort}
        >
          {icon && icon}
          {resolvedTitle}
          {sortIcon}
        </Button>
      </div>
    );
  }
  return (
    <div className={headerLabelClassName}>
      {icon && icon}
      {resolvedTitle}
    </div>
  );
}
const DataGridColumnHeaderMemo = memo(DataGridColumnHeaderInner);
function DataGridColumnHeader(props) {
  const { table } = useDataGrid();
  return (
    <Subscribe
      source={table.store}
      selector={(state) => ({
        sorting: state.sorting,
        columnPinning: state.columnPinning,
        columnOrder: state.columnOrder,
        columnVisibility: state.columnVisibility
      })}
    >
      {(subscribed) => (
        <DataGridColumnHeaderMemo {...props} subscribedState={subscribed} />
      )}
    </Subscribe>
  );
}
export { DataGridColumnHeader };
