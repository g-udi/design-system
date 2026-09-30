'use client';
import {
  useEventCalendarSelector,
  useEventCalendarViewConfig
} from './event-calendar-extended.jsx';
import { EventCalendarAgendaView } from './event-calendar-agenda-view-extended.jsx';
import { EventCalendarMonthView } from './event-calendar-month-view-extended.jsx';
import { EventCalendarResourceView } from './event-calendar-resource-view-extended.jsx';
import {
  EventCalendarDaysView,
  EventCalendarDayView,
  EventCalendarWeekView
} from './event-calendar-time-grid-extended.jsx';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
const DEFAULT_VIEW_COMPONENTS = {
  month: EventCalendarMonthView,
  week: EventCalendarWeekView,
  day: EventCalendarDayView,
  days: EventCalendarDaysView,
  agenda: EventCalendarAgendaView,
  resource: EventCalendarResourceView
};
function EventCalendarContent({
  className,
  asChild = false,
  components,
  children,
  ...props
}) {
  const viewConfig = useEventCalendarViewConfig();
  const view = useEventCalendarSelector((state) => state.view);
  const loading = useEventCalendarSelector((state) => state.loading);
  const resolved = {
    ...DEFAULT_VIEW_COMPONENTS,
    ...viewConfig.components,
    ...components
  };
  const ActiveView = resolved[view] ?? DEFAULT_VIEW_COMPONENTS[view];
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='event-calendar-content'
      data-view={view}
      data-loading={loading || void 0}
      className={cn(
        'relative flex min-h-0 min-w-0 flex-1 flex-col',
        'data-loading:pointer-events-none data-loading:opacity-60',
        viewConfig.classNames?.content,
        className
      )}
      {...props}
    >
      {children ?? <ActiveView />}
    </Comp>
  );
}
export { DEFAULT_VIEW_COMPONENTS, EventCalendarContent };
