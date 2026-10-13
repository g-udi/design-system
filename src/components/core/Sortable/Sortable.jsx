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
const IsOverlayContext = createContext(false);
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
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveId(null);
      onDragEnd?.(event);
      if (!over) return;
      const activeIndex = value.findIndex(
        (item) => getItemValue(item) === active.id
      );
      const overIndex = value.findIndex(
        (item) => getItemValue(item) === over.id
      );
      if (activeIndex === -1 || overIndex === -1) return;
      if (activeIndex !== overIndex) {
        if (onMove) {
          onMove({ event, activeIndex, overIndex });
        } else {
          const newValue = arrayMove(value, activeIndex, overIndex);
          onValueChange(newValue);
          onValueCommit?.(newValue, {
            event,
            activeIndex,
            overIndex,
            previousValue: value
          });
        }
      }
    },
    [value, getItemValue, onValueChange, onMove, onDragEnd, onValueCommit]
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
        <Comp
          data-slot='sortable'
          data-dragging={activeId !== null}
          className={cn(activeId !== null && 'cursor-grabbing!', className)}
          {...props}
        >
          {children}
        </Comp>
      </SortableContext>
      {mounted &&
        createPortal(
          <DragOverlay
            dropAnimation={dropAnimationConfig}
            modifiers={modifiers}
            {...overlayProps}
            className={cn('z-50', activeId !== null && 'cursor-grabbing', overlayClassName)}
          >
            <IsOverlayContext.Provider value={true}>
              {overlayContent}
            </IsOverlayContext.Provider>
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
  if (isOverlay) {
    const Comp2 = asChild ? Slot.Root : 'div';
    return (
      <SortableItemContext.Provider
        value={{ listeners: void 0, isDragging: true, disabled: false }}
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
 * Customises the drag overlay that Sortable always renders. Place it as a direct child of Sortable;
 * `children` is a node or `({ value }) => node` for the active item, and other props go to DragOverlay.
 * Without it, the overlay shows a copy of the active SortableItem.
 */
function SortableOverlay() {
  return null;
}
export { Sortable, SortableItem, SortableItemHandle, SortableOverlay };
