// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from 'react';
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Slot } from 'radix-ui';
import { createPortal } from 'react-dom';
import { cn } from '../../../../utilities/cn/index.js';
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
const animateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });
const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4'
      }
    }
  })
};
const subscribeToNothing = () => () => {};
const getIsMounted = () => true;
const getIsMountedOnServer = () => false;
const MOUSE_SENSOR_OPTIONS = { activationConstraint: { distance: 10 } };
const TOUCH_SENSOR_OPTIONS = {
  activationConstraint: { delay: 250, tolerance: 5 }
};
const KEYBOARD_SENSOR_OPTIONS = {
  coordinateGetter: sortableKeyboardCoordinates
};
const MEASURING_CONFIG = {
  droppable: { strategy: MeasuringStrategy.Always }
};
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
  useLayoutEffect(() => {
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
          className={cn(activeId !== null && 'cursor-grabbing!', className)}
          {...props}
        >
          {children}
        </Comp>
      </DndContext>
    </KanbanContext.Provider>
  );
}
function KanbanBoard({ className, asChild = false, children, ...props }) {
  const { columnIds } = useContext(KanbanContext);
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <SortableContext items={columnIds} strategy={rectSortingStrategy}>
      <Comp
        data-slot='kanban-board'
        className={cn('grid auto-rows-fr gap-4 sm:grid-cols-3', className)}
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
  const isColumnDragging = activeId ? isColumn(activeId) : false;
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
        'opacity-0 transition-opacity group-hover/kanban-column:opacity-100',
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
  const isItemDragging = activeId ? !isColumn(activeId) : false;
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
  return (
    <ItemContext.Provider
      value={{ listeners, isDragging: isItemDragging, disabled }}
    >
      <Comp
        data-slot='kanban-item'
        data-value={value}
        data-dragging={isSortableDragging}
        data-disabled={disabled}
        ref={setNodeRef}
        style={style}
        {...attributes}
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
  const { listeners, isDragging, disabled } = useContext(ItemContext);
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='kanban-item-handle'
      data-dragging={isDragging}
      data-disabled={disabled}
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
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getIsMounted,
    getIsMountedOnServer
  );
  const variant = activeId ? (isColumn(activeId) ? 'column' : 'item') : 'item';
  const content =
    activeId && children
      ? typeof children === 'function'
        ? children({ value: activeId, variant })
        : children
      : null;
  if (!mounted) return null;
  return createPortal(
    <DragOverlay
      dropAnimation={dropAnimationConfig}
      modifiers={modifiers}
      className={cn('z-50', activeId && 'cursor-grabbing', className)}
      {...props}
    >
      <IsOverlayContext.Provider value={true}>
        {content}
      </IsOverlayContext.Provider>
    </DragOverlay>,
    document.body
  );
}
export {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanColumnContent,
  KanbanOverlay
};
