'use client';
import { useIsClient } from '../../../hooks/environment/use-is-client.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Slot } from 'radix-ui';
import { createPortal } from 'react-dom';
import { cn } from '../../../utilities/cn/index.js';
import {
  animateLayoutChanges,
  dropAnimationConfig,
  KEYBOARD_SENSOR_OPTIONS,
  MEASURING_CONFIG,
  MOUSE_SENSOR_OPTIONS,
  TOUCH_SENSOR_OPTIONS
} from '../Sortable/sortableConfig.js';
import { Badge } from '../Pill/Badge.jsx';
const KanbanContext = createContext({
  columns: {},
  setColumns: () => {},
  getItemId: () => '',
  columnIds: [],
  activeId: null,
  setActiveId: () => {},
  findContainer: () => void 0,
  isColumn: () => false,
  modifiers: void 0
});
const ColumnContext = createContext({
  attributes: {},
  listeners: void 0,
  isDragging: false,
  disabled: false
});
const ItemContext = createContext({
  listeners: void 0,
  isDragging: false,
  disabled: false
});
const IsOverlayContext = createContext(false);
function Kanban({
  value,
  onValueChange,
  getItemValue,
  children,
  className,
  asChild = false,
  onMove,
  onValueCommit,
  restoreOnCancel = false,
  onDragStart,
  onDragEnd,
  onDragCancel,
  accessibility,
  modifiers,
  ...props
}) {
  const columns = value;
  const setColumns = onValueChange;
  const [activeId, setActiveId] = useState(null);
  const valueRef = useRef(value);
  const getItemValueRef = useRef(getItemValue);
  useIsomorphicLayoutEffect(() => {
    valueRef.current = value;
    getItemValueRef.current = getItemValue;
  });
  const dragOriginRef = useRef(null);
  const sensors = useSensors(
    useSensor(MouseSensor, MOUSE_SENSOR_OPTIONS),
    useSensor(TouchSensor, TOUCH_SENSOR_OPTIONS),
    useSensor(KeyboardSensor, KEYBOARD_SENSOR_OPTIONS)
  );
  const columnIds = useMemo(() => {
    const keys = Object.keys(columns);
    if (process.env.NODE_ENV !== 'production') {
      const seen = /* @__PURE__ */ new Set();
      for (const key of keys) {
        for (const item of columns[key]) {
          const itemId = getItemValue(item);
          if (seen.has(itemId)) {
            console.warn(
              `[Kanban] Duplicate item id "${itemId}". Item ids must be unique across all columns, or drag and drop will misbehave.`
            );
            break;
          }
          seen.add(itemId);
        }
      }
    }
    return keys;
  }, [columns, getItemValue]);
  const isColumn = useCallback((id) => columnIds.includes(id), [columnIds]);
  const findContainer = useCallback(
    (id) => {
      if (isColumn(id)) return id;
      return columnIds.find((key) =>
        columns[key].some((item) => getItemValue(item) === id)
      );
    },
    [columns, columnIds, getItemValue, isColumn]
  );
  const commitChange = useCallback(
    (finalValue, event, kind) => {
      if (!onValueCommit) return;
      const origin = dragOriginRef.current;
      if (!origin) return;
      const id = event.active.id;
      if (kind === 'column') {
        const keys = Object.keys(finalValue);
        const overIndex2 = keys.indexOf(id);
        if (overIndex2 === -1 || overIndex2 === origin.index) return;
        onValueCommit(finalValue, {
          kind: 'column',
          event,
          activeContainer: id,
          activeIndex: origin.index,
          overContainer: String(event.over?.id ?? id),
          overIndex: overIndex2,
          previousValue: origin.value
        });
        return;
      }
      const getId = getItemValueRef.current;
      let overContainer;
      let overIndex = -1;
      for (const key of Object.keys(finalValue)) {
        const found = finalValue[key].findIndex((item) => getId(item) === id);
        if (found !== -1) {
          overContainer = key;
          overIndex = found;
          break;
        }
      }
      if (overContainer === void 0) return;
      if (overContainer === origin.container && overIndex === origin.index) {
        return;
      }
      onValueCommit(finalValue, {
        kind: 'item',
        event,
        activeContainer: origin.container ?? overContainer,
        activeIndex: origin.index,
        overContainer,
        overIndex,
        previousValue: origin.value
      });
    },
    [onValueCommit]
  );
  const handleDragStart = useCallback(
    (event) => {
      setActiveId(event.active.id);
      onDragStart?.(event);
      if (onValueCommit || restoreOnCancel) {
        const snapshot = valueRef.current;
        const id = event.active.id;
        const keys = Object.keys(snapshot);
        if (keys.includes(id)) {
          dragOriginRef.current = {
            value: snapshot,
            container: id,
            index: keys.indexOf(id)
          };
        } else {
          const getId = getItemValueRef.current;
          let container;
          let index = -1;
          for (const key of keys) {
            const found = snapshot[key].findIndex((item) => getId(item) === id);
            if (found !== -1) {
              container = key;
              index = found;
              break;
            }
          }
          dragOriginRef.current = { value: snapshot, container, index };
        }
      }
    },
    [onDragStart, onValueCommit, restoreOnCancel]
  );
  const handleDragOver = useCallback(
    (event) => {
      if (onMove) {
        return;
      }
      const { active, over } = event;
      if (!over) return;
      if (isColumn(active.id)) return;
      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id);
      if (!activeContainer || !overContainer) {
        return;
      }
      if (activeContainer !== overContainer) {
        const activeItems = columns[activeContainer];
        const overItems = columns[overContainer];
        const activeIndex = activeItems.findIndex(
          (item) => getItemValue(item) === active.id
        );
        let overIndex = overItems.findIndex(
          (item) => getItemValue(item) === over.id
        );
        if (isColumn(over.id)) {
          overIndex = overItems.length;
        }
        const newActiveItems = [...activeItems];
        const newOverItems = [...overItems];
        const [movedItem] = newActiveItems.splice(activeIndex, 1);
        newOverItems.splice(overIndex, 0, movedItem);
        setColumns({
          ...columns,
          [activeContainer]: newActiveItems,
          [overContainer]: newOverItems
        });
      } else {
        const container = activeContainer;
        const activeIndex = columns[container].findIndex(
          (item) => getItemValue(item) === active.id
        );
        const overIndex = columns[container].findIndex(
          (item) => getItemValue(item) === over.id
        );
        if (activeIndex !== overIndex) {
          setColumns({
            ...columns,
            [container]: arrayMove(columns[container], activeIndex, overIndex)
          });
        }
      }
    },
    [findContainer, getItemValue, isColumn, setColumns, columns, onMove]
  );
  const handleDragCancel = useCallback(
    (event) => {
      const origin = dragOriginRef.current;
      if (restoreOnCancel && origin && !onMove) {
        setColumns(origin.value);
      } else if (onValueCommit && origin && !onMove) {
        commitChange(valueRef.current, event, 'item');
      }
      dragOriginRef.current = null;
      setActiveId(null);
      onDragCancel?.(event);
    },
    [
      restoreOnCancel,
      onMove,
      onValueCommit,
      setColumns,
      onDragCancel,
      commitChange
    ]
  );
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveId(null);
      onDragEnd?.(event);
      if (!over) {
        commitChange(valueRef.current, event, 'item');
        dragOriginRef.current = null;
        return;
      }
      if (onMove && !isColumn(active.id)) {
        const activeContainer2 = findContainer(active.id);
        const overContainer2 = findContainer(over.id);
        if (activeContainer2 && overContainer2) {
          const activeIndex = columns[activeContainer2].findIndex(
            (item) => getItemValue(item) === active.id
          );
          const overIndex = isColumn(over.id)
            ? columns[overContainer2].length
            : columns[overContainer2].findIndex(
                (item) => getItemValue(item) === over.id
              );
          onMove({
            event,
            activeContainer: activeContainer2,
            activeIndex,
            overContainer: overContainer2,
            overIndex
          });
        }
        dragOriginRef.current = null;
        return;
      }
      if (isColumn(active.id) && isColumn(over.id)) {
        const activeIndex = columnIds.indexOf(active.id);
        const overIndex = columnIds.indexOf(over.id);
        if (activeIndex !== overIndex) {
          const newOrder = arrayMove(
            Object.keys(columns),
            activeIndex,
            overIndex
          );
          const newColumns = {};
          newOrder.forEach((key) => {
            newColumns[key] = columns[key];
          });
          setColumns(newColumns);
          commitChange(newColumns, event, 'column');
        }
        dragOriginRef.current = null;
        return;
      }
      if (isColumn(active.id)) {
        dragOriginRef.current = null;
        return;
      }
      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id);
      if (
        activeContainer &&
        overContainer &&
        activeContainer === overContainer
      ) {
        const container = activeContainer;
        const activeIndex = columns[container].findIndex(
          (item) => getItemValue(item) === active.id
        );
        const overIndex = columns[container].findIndex(
          (item) => getItemValue(item) === over.id
        );
        if (activeIndex !== overIndex) {
          const newColumns = {
            ...columns,
            [container]: arrayMove(columns[container], activeIndex, overIndex)
          };
          setColumns(newColumns);
          commitChange(newColumns, event, 'item');
        } else {
          commitChange(columns, event, 'item');
        }
      } else {
        commitChange(columns, event, 'item');
      }
      dragOriginRef.current = null;
    },
    [
      columnIds,
      columns,
      findContainer,
      getItemValue,
      isColumn,
      setColumns,
      onMove,
      onDragEnd,
      commitChange
    ]
  );
  const contextValue = useMemo(
    () => ({
      columns,
      setColumns,
      getItemId: getItemValue,
      columnIds,
      activeId,
      setActiveId,
      findContainer,
      isColumn,
      modifiers
    }),
    [
      columns,
      setColumns,
      getItemValue,
      columnIds,
      activeId,
      findContainer,
      isColumn,
      modifiers
    ]
  );
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <KanbanContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        modifiers={modifiers}
        accessibility={accessibility}
        measuring={MEASURING_CONFIG}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <Comp
          data-slot='kanban'
          data-dragging={activeId !== null}
          // min-w-0 lets a scrolling board inside a grid or flex parent scroll in place instead of widening it.
          className={cn('min-w-0', activeId !== null && 'cursor-grabbing!', className)}
          {...props}
        >
          {children}
        </Comp>
      </DndContext>
    </KanbanContext.Provider>
  );
}
// `grid` fits a few columns to the width; `scroll` keeps every column at a fixed width inside its own
// horizontally scrolling, keyboard-focusable region (name it with aria-label), so wide boards never
// widen the page. It is positioned so visually hidden text inside it is clipped with it. Collapsed
// columns shrink to their rail.
const boardLayouts = {
  grid: 'grid auto-rows-fr gap-4 sm:grid-cols-3',
  scroll:
    'relative flex min-w-0 max-w-full items-stretch gap-3 overflow-x-auto overscroll-x-contain pb-2 *:data-[slot=kanban-column]:shrink-0 *:data-[slot=kanban-column]:not-data-[collapsed=true]:w-72'
};
function KanbanBoard({ className, asChild = false, layout = 'grid', children, ...props }) {
  const { columnIds } = useContext(KanbanContext);
  const Comp = asChild ? Slot.Root : 'div';
  const scroll = layout === 'scroll';
  return (
    <SortableContext items={columnIds} strategy={rectSortingStrategy}>
      <Comp
        data-slot='kanban-board'
        data-layout={layout}
        role={scroll ? 'region' : undefined}
        tabIndex={scroll ? 0 : undefined}
        className={cn(boardLayouts[layout] ?? boardLayouts.grid, className)}
        {...props}
      >
        {children}
      </Comp>
    </SortableContext>
  );
}
function KanbanColumn({
  value,
  className,
  asChild = false,
  disabled,
  collapsed = false,
  children,
  ...props
}) {
  const isOverlay = useContext(IsOverlayContext);
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging
  } = useSortable({
    id: value,
    disabled: disabled || isOverlay,
    animateLayoutChanges
  });
  const { activeId, isColumn } = useContext(KanbanContext);
  const isColumnDragging = activeId !== null ? isColumn(activeId) : false;
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };
  const Comp = asChild ? Slot.Root : 'div';
  if (isOverlay) {
    return (
      <ColumnContext.Provider
        value={{
          attributes: {},
          listeners: void 0,
          isDragging: true,
          disabled: false
        }}
      >
        <Comp
          data-slot='kanban-column'
          data-value={value}
          data-dragging={true}
          data-collapsed={collapsed || undefined}
          className={cn('group/kanban-column flex flex-col', className)}
          {...props}
        >
          {children}
        </Comp>
      </ColumnContext.Provider>
    );
  }
  return (
    <ColumnContext.Provider
      value={{ attributes, listeners, isDragging: isColumnDragging, disabled }}
    >
      <Comp
        data-slot='kanban-column'
        data-value={value}
        data-dragging={isSortableDragging}
        data-disabled={disabled}
        data-collapsed={collapsed || undefined}
        ref={setNodeRef}
        style={style}
        className={cn(
          'group/kanban-column flex flex-col',
          isSortableDragging && 'z-50 opacity-50',
          disabled && 'opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    </ColumnContext.Provider>
  );
}
function KanbanColumnHandle({
  className,
  asChild = false,
  cursor = true,
  children,
  ...props
}) {
  const { attributes, listeners, isDragging, disabled } =
    useContext(ColumnContext);
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='kanban-column-handle'
      data-dragging={isDragging}
      data-disabled={disabled}
      {...attributes}
      {...listeners}
      className={cn(
        'opacity-0 transition-opacity group-hover/kanban-column:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100',
        cursor && (isDragging ? 'cursor-grabbing!' : 'cursor-grab!'),
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
function KanbanItem({
  value,
  className,
  asChild = false,
  disabled,
  withHandle = false,
  children,
  ...props
}) {
  const isOverlay = useContext(IsOverlayContext);
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging
  } = useSortable({
    id: value,
    disabled: disabled || isOverlay,
    animateLayoutChanges
  });
  const { activeId, isColumn } = useContext(KanbanContext);
  const isItemDragging = activeId !== null ? !isColumn(activeId) : false;
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };
  const Comp = asChild ? Slot.Root : 'div';
  if (isOverlay) {
    return (
      <ItemContext.Provider
        value={{ listeners: void 0, isDragging: true, disabled: false }}
      >
        <Comp
          data-slot='kanban-item'
          data-value={value}
          data-dragging={true}
          className={cn(className)}
          {...props}
        >
          {children}
        </Comp>
      </ItemContext.Provider>
    );
  }
  // With `withHandle`, the sortable role and keyboard focus move to KanbanItemHandle, so a card can hold
  // its own buttons and menus without nesting them inside an interactive element.
  return (
    <ItemContext.Provider
      value={{ listeners, isDragging: isItemDragging, disabled, attributes: withHandle ? attributes : undefined }}
    >
      <Comp
        data-slot='kanban-item'
        data-value={value}
        data-dragging={isSortableDragging}
        data-disabled={disabled}
        ref={setNodeRef}
        style={style}
        {...(withHandle ? {} : { ...attributes, ...listeners })}
        className={cn(
          isSortableDragging && 'z-50 opacity-50',
          disabled && 'opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    </ItemContext.Provider>
  );
}
function KanbanItemHandle({
  className,
  asChild = false,
  cursor = true,
  children,
  ...props
}) {
  const { listeners, isDragging, disabled, attributes } = useContext(ItemContext);
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='kanban-item-handle'
      data-dragging={isDragging}
      data-disabled={disabled}
      {...attributes}
      {...listeners}
      className={cn(
        cursor && (isDragging ? 'cursor-grabbing!' : 'cursor-grab!'),
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
function KanbanColumnContent({
  value,
  className,
  asChild = false,
  children,
  ...props
}) {
  const { columns, getItemId } = useContext(KanbanContext);
  const itemIds = useMemo(() => {
    const items = columns[value];
    if (!items) {
      throw new Error(
        `KanbanColumnContent: column "${value}" was not found in the Kanban value. Available columns: ${Object.keys(columns).join(', ') || '(none)'}.`
      );
    }
    return items.map(getItemId);
  }, [columns, getItemId, value]);
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      <Comp
        data-slot='kanban-column-content'
        className={cn('flex flex-col gap-2', className)}
        {...props}
      >
        {children}
      </Comp>
    </SortableContext>
  );
}
function KanbanOverlay({ children, className, ...props }) {
  const { activeId, isColumn, modifiers } = useContext(KanbanContext);
  const mounted = useIsClient();
  const variant = activeId !== null && isColumn(activeId) ? 'column' : 'item';
  const content =
    activeId !== null && children
      ? typeof children === 'function'
        ? children({ value: activeId, variant })
        : children
      : null;
  if (!mounted) return null;
  return createPortal(
    <DragOverlay
      dropAnimation={dropAnimationConfig}
      modifiers={modifiers}
      className={cn('z-50', activeId !== null && 'cursor-grabbing', className)}
      {...props}
    >
      <IsOverlayContext.Provider value={true}>
        {content}
      </IsOverlayContext.Provider>
    </DragOverlay>,
    document.body
  );
}
/**
 * The number of cards in a column, with an optional work-in-progress limit. Over the limit the count
 * turns to the warning tone and says so to assistive tech; the visible text stays compact (3/4).
 */
function KanbanColumnCount({
  count,
  limit,
  className,
  formatLabel = (value, max, over) =>
    max == null
      ? `${value} ${value === 1 ? 'card' : 'cards'}`
      : `${value} of ${max} cards${over ? ', over the limit' : ''}`,
  ...props
}) {
  const hasLimit = Number.isFinite(limit);
  const over = hasLimit && count > limit;
  return (
    <Badge
      data-slot='kanban-column-count'
      data-over-limit={over || undefined}
      variant={over ? 'warning-light' : 'outline'}
      size='sm'
      className={cn('tabular-nums', className)}
      {...props}
    >
      <span aria-hidden='true'>{hasLimit ? `${count}/${limit}` : count}</span>
      <span className='sr-only'>{formatLabel(count, hasLimit ? limit : null, over)}</span>
    </Badge>
  );
}
/**
 * A collapsed column drawn as a narrow vertical rail. It is a button that expands the column, and,
 * because it sits inside the KanbanColumn, cards dropped on it still land in that column.
 */
function KanbanColumnRail({ label, count, icon, onExpand, expandLabel = 'Expand', className, ...props }) {
  return (
    <button
      type='button'
      data-slot='kanban-column-rail'
      aria-expanded={false}
      aria-label={`${expandLabel} ${label}${count == null ? '' : `, ${count} ${count === 1 ? 'card' : 'cards'}`}`}
      onClick={onExpand}
      className={cn(
        'flex h-full min-h-40 w-10 flex-col items-center gap-2 rounded-lg border border-border bg-surface-muted py-3 text-xs font-medium text-text transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        className
      )}
      {...props}
    >
      {icon}
      <span className='[writing-mode:vertical-rl] rotate-180 whitespace-nowrap'>{label}</span>
      {count == null ? null : <span className='tabular-nums text-text-muted'>{count}</span>}
    </button>
  );
}
export {
  Kanban,
  KanbanBoard,
  KanbanColumnCount,
  KanbanColumnRail,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanColumnContent,
  KanbanOverlay
};
