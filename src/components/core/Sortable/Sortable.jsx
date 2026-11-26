'use client';
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
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
  horizontalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Slot } from 'radix-ui';
import { createPortal } from 'react-dom';
import { useIsClient } from '../../../hooks/environment/use-is-client.js';
import { cn } from '../../../utilities/cn/index.js';
import {
  animateLayoutChanges,
  dropAnimationConfig,
  KEYBOARD_SENSOR_OPTIONS,
  MEASURING_CONFIG,
  MOUSE_SENSOR_OPTIONS,
  TOUCH_SENSOR_OPTIONS
} from './sortableConfig.js';
const SortableItemContext = createContext({
  listeners: void 0,
  isDragging: false,
  disabled: false
});
const OverlayPositionContext = createContext(null);
const MoveContext = createContext(null);
const STRATEGY_MAP = {
  horizontal: horizontalListSortingStrategy,
  grid: rectSortingStrategy,
  vertical: verticalListSortingStrategy
};
function Sortable({
  value,
  onValueChange,
  getItemValue,
  className,
  asChild = false,
  onMove,
  onValueCommit,
  strategy = 'vertical',
  onDragStart,
  onDragEnd,
  onDragCancel,
  accessibility,
  modifiers,
  children,
  ...props
}) {
  const [activeId, setActiveId] = useState(null);
  const mounted = useIsClient();
  const sensors = useSensors(
    useSensor(MouseSensor, MOUSE_SENSOR_OPTIONS),
    useSensor(TouchSensor, TOUCH_SENSOR_OPTIONS),
    useSensor(KeyboardSensor, KEYBOARD_SENSOR_OPTIONS)
  );
  const handleDragStart = useCallback(
    (event) => {
      setActiveId(event.active.id);
      onDragStart?.(event);
    },
    [onDragStart]
  );
  const move = useCallback(
    (activeIndex, overIndex, event) => {
      if (activeIndex < 0 || overIndex < 0 || overIndex >= value.length || activeIndex === overIndex) return;
      if (onMove) {
        onMove({ event, activeIndex, overIndex });
        return;
      }
      const next = arrayMove(value, activeIndex, overIndex);
      onValueChange(next);
      onValueCommit?.(next, { event, activeIndex, overIndex, previousValue: value });
    },
    [value, onValueChange, onValueCommit, onMove]
  );
  const handleDragEnd = useCallback(
    (event) => {
      setActiveId(null);
      onDragEnd?.(event);
      if (event.over) {
        move(
          value.findIndex((item) => getItemValue(item) === event.active.id),
          value.findIndex((item) => getItemValue(item) === event.over.id),
          event
        );
      }
    },
    [value, getItemValue, move, onDragEnd]
  );
  const handleDragCancel = useCallback(
    (event) => {
      setActiveId(null);
      onDragCancel?.(event);
    },
    [onDragCancel]
  );
  const itemIds = useMemo(() => {
    const ids = value.map(getItemValue);
    if (process.env.NODE_ENV !== 'production') {
      const seen = new Set();
      for (const id of ids) {
        if (seen.has(id)) {
          console.warn(
            `[Sortable] Duplicate item id "${id}". Item ids must be unique, or drag and drop will misbehave.`
          );
          break;
        }
        seen.add(id);
      }
    }
    return ids;
  }, [value, getItemValue]);
  const {
    children: overlayChildren,
    className: overlayClassName,
    ...overlayProps
  } = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === SortableOverlay
  )?.props ?? {};
  const overlayContent = useMemo(() => {
    if (activeId == null) return null;
    if (overlayChildren) {
      return typeof overlayChildren === 'function'
        ? overlayChildren({ value: activeId })
        : overlayChildren;
    }
    let result = null;
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.props.value === activeId) {
        result = cloneElement(child, {
          ...child.props,
          className: cn(child.props.className, 'z-50')
        });
      }
    });
    return result;
  }, [activeId, children, overlayChildren]);
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <DndContext
      sensors={sensors}
      modifiers={modifiers}
      accessibility={accessibility}
      measuring={MEASURING_CONFIG}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={itemIds}
        strategy={STRATEGY_MAP[strategy] ?? verticalListSortingStrategy}
      >
        <MoveContext.Provider value={move}>
          <Comp
            data-slot='sortable'
            data-dragging={activeId !== null}
            className={cn(activeId !== null && 'cursor-grabbing!', className)}
            {...props}
          >
            {children}
          </Comp>
        </MoveContext.Provider>
      </SortableContext>
      {mounted &&
        createPortal(
          <DragOverlay
            dropAnimation={dropAnimationConfig}
            modifiers={modifiers}
            {...overlayProps}
            className={cn('z-50', activeId !== null && 'cursor-grabbing', overlayClassName)}
          >
            <OverlayPositionContext.Provider value={{ id: activeId, index: itemIds.indexOf(activeId), count: itemIds.length }}>
              {overlayContent}
            </OverlayPositionContext.Provider>
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
function SortableItem({
  value,
  className,
  style,
  asChild = false,
  disabled,
  children,
  ...props
}) {
  const overlay = useContext(OverlayPositionContext);
  const {
    setNodeRef,
    index,
    items,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging
  } = useSortable({
    id: value,
    disabled: disabled || Boolean(overlay),
    animateLayoutChanges
  });
  if (overlay) {
    const Comp2 = asChild ? Slot.Root : 'div';
    return (
      <SortableItemContext.Provider
        value={{
          isDragging: true,
          index: overlay.id === value ? overlay.index : index,
          count: overlay.id === value ? overlay.count : items.length
        }}
      >
        <Comp2
          data-slot='sortable-item'
          data-value={value}
          data-dragging={true}
          aria-hidden='true'
          className={className}
          style={style}
          {...props}
        >
          {children}
        </Comp2>
      </SortableItemContext.Provider>
    );
  }
  const itemStyle = {
    ...style,
    transition: transition ?? style?.transition,
    transform: CSS.Transform.toString(transform) ?? style?.transform
  };
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <SortableItemContext.Provider
      value={{
        listeners,
        attributes,
        index,
        count: items.length,
        isDragging: isSortableDragging,
        disabled
      }}
    >
      <Comp
        data-slot='sortable-item'
        data-value={value}
        data-dragging={isSortableDragging}
        data-disabled={disabled}
        ref={setNodeRef}
        style={itemStyle}
        className={cn(
          isSortableDragging && 'z-50 opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    </SortableItemContext.Provider>
  );
}
function SortableItemHandle({
  className,
  asChild = false,
  cursor = true,
  children,
  ...props
}) {
  const { listeners, attributes, isDragging, disabled } =
    useContext(SortableItemContext);
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      {...attributes}
      aria-label={attributes ? 'Reorder item' : undefined}
      data-slot='sortable-item-handle'
      data-dragging={isDragging}
      data-disabled={disabled}
      {...listeners}
      className={cn(
        'inline-flex min-h-8 min-w-8 shrink-0 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent pointer-coarse:min-h-11 pointer-coarse:min-w-11',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : cursor && (isDragging ? 'cursor-grabbing!' : 'cursor-grab!'),
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
/**
 * A native, single-pointer alternative to dragging. The current position stays
 * visible when the picker closes, including when a pending save reverts a move.
 */
function SortableItemPosition({ className, onChange, ...props }) {
  const move = useContext(MoveContext);
  const item = useContext(SortableItemContext);
  const lifted = useContext(OverlayPositionContext);
  const { index, count } = item.index == null && lifted ? lifted : item;
  if (index == null) return null;
  const unavailable = Boolean(lifted) || !move || item.disabled || count < 2;
  return (
    <select
      aria-label='Change position'
      {...props}
      aria-disabled={unavailable || undefined}
      disabled={Boolean(lifted) || props.disabled}
      data-slot='sortable-item-position'
      className={cn('min-h-8 w-12 max-w-full shrink-0 rounded-md border border-ui-border bg-ui-background px-1 text-xs text-ui-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent pointer-coarse:min-h-11', className)}
      value=''
      onChange={(event) => {
        onChange?.(event);
        if (!event.defaultPrevented && !unavailable && event.target.value) {
          move(index, index + Number(event.target.value), event);
        }
      }}
    >
      <option value=''>{index + 1}</option>
      <option value='-1' disabled={unavailable || index === 0}>Move earlier</option>
      <option value='1' disabled={unavailable || index === count - 1}>Move later</option>
    </select>
  );
}
/**
 * Customises the drag overlay that Sortable always renders. Place it as a direct child of Sortable;
 * `children` is a node or `({ value }) => node` for the active item, and other props go to DragOverlay.
 * Without it, the overlay shows a copy of the active SortableItem.
 */
function SortableOverlay() {
  return null;
}
export { Sortable, SortableItem, SortableItemHandle, SortableItemPosition, SortableOverlay };
