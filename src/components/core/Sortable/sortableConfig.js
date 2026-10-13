import { defaultDropAnimationSideEffects, MeasuringStrategy } from '@dnd-kit/core';
import { defaultAnimateLayoutChanges, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// dnd-kit configuration shared by Sortable and Kanban so both lists pick up,
// animate and drop items the same way.
export const animateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });
export const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4'
      }
    }
  })
};
export const MOUSE_SENSOR_OPTIONS = { activationConstraint: { distance: 10 } };
export const TOUCH_SENSOR_OPTIONS = {
  activationConstraint: { delay: 250, tolerance: 5 }
};
export const KEYBOARD_SENSOR_OPTIONS = {
  coordinateGetter: sortableKeyboardCoordinates
};
export const MEASURING_CONFIG = {
  droppable: { strategy: MeasuringStrategy.Always }
};
